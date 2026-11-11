[CmdletBinding()]
param(
    [switch]$Junction,
    [switch]$Rtk,
    [switch]$ClaudeMem,
    [switch]$Caveman,
    [switch]$Graphify,
    [switch]$Headroom,
    [switch]$UpstreamSkills,
    [switch]$All
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
Set-Location $root

function Test-Cmd([string]$name) { [bool](Get-Command $name -ErrorAction SilentlyContinue) }
function Step([string]$text) { Write-Host "`n==> $text" -ForegroundColor Cyan }
function Skip([string]$text) { Write-Host "    skip: $text" -ForegroundColor Yellow }

if (-not ($Junction -or $Rtk -or $ClaudeMem -or $Caveman -or $Graphify -or $Headroom -or $UpstreamSkills -or $All)) {
    Write-Host "Pemakaian: .\setup-token-stack.ps1 -Junction -Rtk -ClaudeMem -Caveman -Graphify -Headroom  (atau -All)"
    Write-Host "Disarankan mulai dari: -Junction -Rtk -ClaudeMem -Caveman"
    return
}

if ($All) { $Junction = $Rtk = $ClaudeMem = $Caveman = $Graphify = $Headroom = $UpstreamSkills = $true }

if ($Junction) {
    Step "Menghubungkan .claude\skills -> .agents\skills"
    $target = Join-Path $root '.agents\skills'
    $link = Join-Path $root '.claude\skills'
    if (-not (Test-Path $target)) { throw ".agents\skills tidak ditemukan" }
    New-Item -ItemType Directory -Force -Path (Join-Path $root '.claude') | Out-Null
    if (Test-Path $link) { Skip ".claude\skills sudah ada" }
    else { New-Item -ItemType Junction -Path $link -Target $target | Out-Null; Write-Host "    ok" }
}

if ($Rtk) {
    Step "rtk (Rust Token Killer)"
    if (-not (Test-Cmd rtk)) {
        if (Test-Cmd cargo) { cargo install --git https://github.com/rtk-ai/rtk }
        else { Skip "cargo tidak ada. Unduh binary Windows dari https://github.com/rtk-ai/rtk/releases lalu taruh di PATH, kemudian jalankan ulang." }
    }
    if (Test-Cmd rtk) {
        rtk gain
        rtk init -g
        rtk init --agent antigravity
        Write-Host "    Restart Claude Code. Jika 'rtk gain' menolak, kemungkinan paket 'rtk' yang salah (Rust Type Kit): cargo uninstall rtk"
    }
}

if ($ClaudeMem) {
    Step "claude-mem (memori lintas sesi)"
    if (-not (Test-Cmd npx)) { Skip "Node.js 20+ belum terpasang" }
    else {
        npx claude-mem install --provider claude
        npx claude-mem install --ide antigravity
        npx claude-mem doctor
    }
}

if ($Caveman) {
    Step "caveman (jawaban ringkas)"
    if (-not (Test-Cmd claude)) { Skip "CLI claude belum terpasang" }
    else {
        claude plugin marketplace add JuliusBrussee/caveman
        claude plugin install caveman@caveman
    }
}

if ($Graphify) {
    Step "graphify (knowledge graph codebase)"
    if (Test-Cmd uv) { uv tool install graphifyy }
    elseif (Test-Cmd pipx) { pipx install graphifyy }
    else { Skip "butuh uv atau pipx (Python 3.10+)" }
    if (Test-Cmd graphify) {
        graphify install --project
        Write-Host "    Setelah ada kode: di Claude Code ketik  /graphify .   (di PowerShell biasa: graphify .)"
    }
}

if ($Headroom) {
    Step "headroom (kompresi konteks, unduhan model besar)"
    if (Test-Cmd uv) { uv tool install --python 3.13 "headroom-ai[all]" }
    elseif (Test-Cmd pip) { pip install "headroom-ai[all]" }
    else { Skip "butuh uv atau pip (Python 3.10+)" }
    if (Test-Cmd headroom) {
        headroom mcp install
        Write-Host "    Jalankan Claude lewat:  headroom wrap claude"
    }
}

if ($UpstreamSkills) {
    Step "Skill lengkap caveman & graphify dari repo asli (masuk ke .agents\skills)"
    if (-not (Test-Cmd npx)) { Skip "Node.js belum terpasang" }
    else {
        npx -y skills add JuliusBrussee/caveman
        npx -y skills add Graphify-Labs/graphify --skill graphify
    }
}

Write-Host "`nSelesai. Restart Claude Code / Antigravity agar hook dan skill terbaca." -ForegroundColor Green
