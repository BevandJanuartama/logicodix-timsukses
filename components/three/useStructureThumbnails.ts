import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/lib/store'
import { sceneRegistry } from '@/lib/three/registry'
import { ANATOMY_HOTSPOTS, resolveAnchor, type HotspotSpec } from './hotspotAnchors'

const THUMB_PIXELS = 112
const SETTLE_SECONDS = 1.6
const FRAME_STRIDE = 4
const BACKGROUND = '#F6ECE1'
const THUMB_FOV = 28
const SIDE_REACH = 2.6
const TOOTH_DISTANCE = 4.2
const GUM_DISTANCE = 6
const TONGUE_DISTANCE = 3.4
const TONGUE_HEIGHT = 5

const TARGETS = ANATOMY_HOTSPOTS

function placeEye(eye: THREE.Vector3, target: THREE.Vector3, spec: HotspotSpec) {
  switch (spec.anchor.kind) {
    case 'tooth':
      return eye.set(target.x + Math.sign(target.x || 1) * SIDE_REACH, target.y + 1.1, target.z + TOOTH_DISTANCE)
    case 'gum':
      return eye.set(target.x, target.y + 0.6, target.z + GUM_DISTANCE)
    case 'tongue':
      return eye.set(target.x, target.y + TONGUE_HEIGHT, target.z + TONGUE_DISTANCE)
  }
}

function createCropCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = THUMB_PIXELS
  canvas.height = THUMB_PIXELS
  return canvas
}

function useStructureThumbnails() {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const camera = useMemo(() => new THREE.PerspectiveCamera(THUMB_FOV, 1, 0.05, 120), [])
  const crop = useMemo(createCropCanvas, [])
  const scratch = useMemo(
    () => ({
      target: new THREE.Vector3(),
      eye: new THREE.Vector3(),
      viewport: new THREE.Vector4(),
      scissor: new THREE.Vector4(),
    }),
    [],
  )
  const cursor = useRef(0)
  const frameTick = useRef(0)
  const finished = useRef(false)
  const railVisible = useRef(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1280px)')
    const sync = () => {
      railVisible.current = media.matches
    }
    sync()
    media.addEventListener('change', sync)
    return () => {
      media.removeEventListener('change', sync)
      crop.width = 0
      crop.height = 0
    }
  }, [crop])

  useFrame((state) => {
    if (finished.current || !railVisible.current || state.clock.elapsedTime < SETTLE_SECONDS) return
    frameTick.current += 1
    if (frameTick.current % FRAME_STRIDE !== 0) return
    if (cursor.current >= TARGETS.length) {
      finished.current = true
      return
    }
    const spec = TARGETS[cursor.current]
    const anchor = resolveAnchor(spec.anchor)
    if (!anchor) return
    cursor.current += 1
    if (useAppStore.getState().thumbnails[spec.id]) return

    const { target, eye, viewport, scissor } = scratch
    target.copy(anchor.local)
    anchor.source.localToWorld(target)
    placeEye(eye, target, spec)
    camera.position.copy(eye)
    camera.lookAt(target)
    camera.updateMatrixWorld()

    const ratio = gl.getPixelRatio()
    const cssSize = THUMB_PIXELS / ratio
    const upperJaw = sceneRegistry.jaws.upper
    const upperWasVisible = upperJaw?.visible ?? true
    const scissorWasOn = gl.getScissorTest()
    gl.getViewport(viewport)
    gl.getScissor(scissor)
    if (spec.anchor.kind === 'tongue' && upperJaw) upperJaw.visible = false

    gl.setViewport(0, 0, cssSize, cssSize)
    gl.setScissor(0, 0, cssSize, cssSize)
    gl.setScissorTest(true)
    gl.render(scene, camera)

    const context = crop.getContext('2d')
    if (context) {
      context.fillStyle = BACKGROUND
      context.fillRect(0, 0, THUMB_PIXELS, THUMB_PIXELS)
      const source = gl.domElement
      context.drawImage(source, 0, source.height - THUMB_PIXELS, THUMB_PIXELS, THUMB_PIXELS, 0, 0, THUMB_PIXELS, THUMB_PIXELS)
      useAppStore.getState().setThumbnail(spec.id, crop.toDataURL('image/png'))
    }

    if (upperJaw) upperJaw.visible = upperWasVisible
    gl.setScissorTest(scissorWasOn)
    gl.setScissor(scissor)
    gl.setViewport(viewport)
  })
}

export function StructureThumbnails() {
  useStructureThumbnails()
  return null
}
