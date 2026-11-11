import sys
import os
import re
import argparse

SKILLS_CATALOG = {
    "brainstorming": {
        "category": "Process & Ideation",
        "keywords": ["brainstorm", "ide", "konsep", "fitur baru", "diskusi", "pikirkan", "alternatif", "eksplorasi", "kebutuhan", "creative work", "planning anything new", "tanya"],
        "summary": "Wajib digunakan sebelum memulai fitur atau proyek baru untuk menggali kebutuhan, alternatif, dan konfirmasi pengguna.",
        "command": "Konsultasi interaktif & ajukan 2-3 pertanyaan terfokus ke pengguna.",
        "path": ".agents/skills/brainstorming/SKILL.md"
    },
    "writing-plans": {
        "category": "Process & Architecture",
        "keywords": ["buat plan", "bikin plan", "rencana", "roadmap", "task.md", "plan.md", "spesifikasi", "breakdown", "arsitektur", "tahapan", "fase"],
        "summary": "Menyusun dokumen rencana kerja menyeluruh di .agents/plan/PLAN.md dan checklist tugas terperinci di TASK.md.",
        "command": "Tulis/update .agents/plan/PLAN.md dan .agents/plan/TASK.md sebelum menulis kode.",
        "path": ".agents/skills/writing-plans/SKILL.md"
    },
    "executing-plans": {
        "category": "Process & Execution",
        "keywords": ["eksekusi", "lanjutkan fase", "kerjakan", "tahap berikutnya", "step by step", "implementasikan", "mulai coding", "next task"],
        "summary": "Mengeksekusi rencana fase demi fase secara berjenjang (satu section/milestone per giliran tanpa terburu-buru).",
        "command": "Kerjakan tepat 1 fase, verifikasi, perbarui TASK.md, lalu minta approval.",
        "path": ".agents/skills/executing-plans/SKILL.md"
    },
    "systematic-debugging": {
        "category": "Engineering & QA",
        "keywords": ["bug", "error", "gagal", "rusak", "crash", "kenapa tidak bisa", "tidak jalan", "failed", "exception", "debug", "troubleshoot"],
        "summary": "Investigasi akar masalah 4 tahap tanpa tebak-tebakan (Reproduce -> Isolate -> Formulate Hypothesis -> Fix & Verify).",
        "command": "Cari akar masalah objektif dengan log/tes sebelum mengubah kode.",
        "path": ".agents/skills/systematic-debugging/SKILL.md"
    },
    "verification-before-completion": {
        "category": "Engineering & QA",
        "keywords": ["selesai", "sudah jadi", "cek kelengkapan", "verifikasi", "test", "lint", "build", "claim complete", "proof"],
        "summary": "Verifikasi empiris sebelum menyatakan pekerjaan selesai (jalankan linter, unit test, build check, dan audit anti-slop).",
        "command": "npm run build / npm test / verifikasi visual sebelum mengklaim selesai.",
        "path": ".agents/skills/verification-before-completion/SKILL.md"
    },
    "context7": {
        "category": "Documentation & APIs",
        "keywords": ["dokumentasi", "library", "sdk", "api pihak ketiga", "sintaks", "deprecate", "versi", "ctx7", "gemini api", "stripe", "supabase", "react 19"],
        "summary": "Mengambil dokumentasi resmi terkini dan contoh kode live dari ribuan pustaka melalui Context7 CLI.",
        "command": "npx ctx7 library <name> \"[query]\" && npx ctx7 docs <id> \"<query>\"",
        "path": ".agents/skills/context7/SKILL.md"
    },
    "taste-skill": {
        "category": "UI/UX & Art Direction",
        "keywords": ["anti-slop", "art direction", "awwwards", "desain unik", "bukan generic ai", "hero section", "poker table", "cinematic", "scrollytelling", "landing page", "luxury"],
        "summary": "Kurasi arah seni visual kelas dunia (Awwwards/One Page Love), melarang template generic AI, serta browser inspector anti-slop.",
        "command": "node .agents/skills/taste-skill/scripts/draw.mjs --sector <sector> --brief \"<brief>\"",
        "path": ".agents/skills/taste-skill/SKILL.md"
    },
    "animate": {
        "category": "Motion & Interaction",
        "keywords": ["animasi", "animate", "transisi", "easing", "duration", "hover effect", "micro-interaction", "durasi"],
        "summary": "Membangun satu animasi dari nol: perlu animasi atau tidak, tujuan, tool, properti, kurva, durasi, interupsi, dan exit.",
        "command": "Ikuti urutan keputusan di animate/SKILL.md; resep ada di animate/RECIPES.md.",
        "path": ".agents/skills/animate/SKILL.md"
    },
    "choreograph": {
        "category": "Motion & Interaction",
        "keywords": ["choreograph", "koreografi", "stagger", "urutan animasi", "beberapa elemen bergerak", "sequence", "overlap"],
        "summary": "Mengoordinasi banyak elemen yang beranimasi bersama agar terbaca sebagai satu gerak yang disengaja.",
        "command": "Ikuti choreograph/SKILL.md; resep ada di choreograph/RECIPES.md.",
        "path": ".agents/skills/choreograph/SKILL.md"
    },
    "apple-design": {
        "category": "Motion & Interaction",
        "keywords": ["gesture", "spring", "drag", "swipe", "bottom sheet", "momentum", "interruptible", "glass", "translucent", "fluid"],
        "summary": "Pendekatan desain & gerak fluid ala Apple untuk web: gesture, spring, sheet, transisi yang bisa diinterupsi, material translusen.",
        "command": "Ikuti apple-design/SKILL.md untuk UI berbasis gesture dan spring.",
        "path": ".agents/skills/apple-design/SKILL.md"
    },
    "emil-design-eng": {
        "category": "UI/UX Polish & Craft",
        "keywords": ["emil", "ui polish", "detail kecil", "terasa halus", "feel great", "component feel", "invisible details"],
        "summary": "Filosofi Emil Kowalski tentang polish UI, desain komponen, keputusan animasi, dan detail tak kasatmata.",
        "command": "Ikuti emil-design-eng/SKILL.md saat menyempurnakan rasa sebuah komponen.",
        "path": ".agents/skills/emil-design-eng/SKILL.md"
    },
    "web-design-guidelines": {
        "category": "UI/UX Review",
        "keywords": ["review ui", "check accessibility", "audit design", "review ux", "best practices", "web interface guidelines", "cek aksesibilitas"],
        "summary": "Review kode UI terhadap Web Interface Guidelines (aksesibilitas, UX, best practice).",
        "command": "Jalankan review sesuai web-design-guidelines/SKILL.md pada file/pola yang diberikan.",
        "path": ".agents/skills/web-design-guidelines/SKILL.md"
    },
    "ui-ux-pro-max": {
        "category": "UI/UX & Design Systems",
        "keywords": ["palet warna", "color palette", "font pairing", "tipografi", "design token", "style", "gsap animation", "card design", "tabletop", "dashboard"],
        "summary": "Database intelijen desain lokal: 79 gaya desain, 192 palet warna industri, 74 pasangan font, 17 preset animasi GSAP.",
        "command": "python .agents/skills/ui-ux-pro-max/scripts/search.py \"<query>\" --design-system -p \"<Project>\"",
        "path": ".agents/skills/ui-ux-pro-max/SKILL.md"
    },
    "impeccable": {
        "category": "UI/UX Polish & Craft",
        "keywords": ["polish", "perbaiki ui", "bikin rapi", "audit visual", "hierarchy", "spacing", "accessibility", "craft", "surface mode", "sentuhan akhir"],
        "summary": "Penyempurnaan visual micro-craft (Persuade/Operate modes), audit hierarki, spacing ritmis, dan penguatan kontras estetika.",
        "command": ".agents\\skills\\impeccable\\scripts\\impeccable.cmd context",
        "path": ".agents/skills/impeccable/SKILL.md"
    },
    "ui-styling": {
        "category": "Frontend Components",
        "keywords": ["tailwind", "shadcn", "radix", "komponen ui", "modal", "button", "card", "dropdown", "dialog", "styling", "css utility"],
        "summary": "Pembuatan komponen UI modern dan aksesibel dengan Tailwind CSS utility-first dan pola komponen shadcn/ui.",
        "command": "Gunakan token Tailwind semantic dan pola komponen headless/radix.",
        "path": ".agents/skills/ui-styling/SKILL.md"
    },
    "design-system": {
        "category": "Design Architecture",
        "keywords": ["token architecture", "primitive token", "semantic token", "css variables", "spacing scale", "typography scale", "design tokens"],
        "summary": "Arsitektur token desain 3-lapis (primitive -> semantic -> component), standarisasi CSS variables dan skala modular.",
        "command": "Definisikan CSS variables di :root dan petakan ke semantic tokens.",
        "path": ".agents/skills/design-system/SKILL.md"
    },
    "design": {
        "category": "Brand & Graphic Assets",
        "keywords": ["logo", "cip", "corporate identity", "icon svg", "banner ads", "mockup", "gambar sosial", "visual asset"],
        "summary": "Generasi aset grafis komprehensif: 55 gaya logo AI, corporate identity 50 deliverables, dan 15 variasi ikon SVG kustom.",
        "command": "Rancang spesifikasi SVG kustom atau prompt model visual berkualitas tinggi.",
        "path": ".agents/skills/design/SKILL.md"
    },
    "brand": {
        "category": "Brand & Strategy",
        "keywords": ["tone of voice", "brand voice", "messaging", "tagline", "identitas brand", "brand guideline", "copywriting brand"],
        "summary": "Penetapan karakter suara brand, kerangka pesan pemasaran, panduan tone of voice, dan kepatuhan konsistensi brand.",
        "command": "Susun tone of voice matrix dan vocabulary guidelines.",
        "path": ".agents/skills/brand/SKILL.md"
    },
    "banner-design": {
        "category": "Marketing & Social Graphics",
        "keywords": ["banner", "poster", "instagram feed", "youtube thumbnail", "hero banner", "ads banner", "promo banner"],
        "summary": "Desain banner media sosial, iklan Google Display, hero website, dan aset promosi dengan berbagai rasio aspek & gaya visual.",
        "command": "Gunakan spesifikasi ukuran di references/banner-sizes-and-styles.md.",
        "path": ".agents/skills/banner-design/SKILL.md"
    },
    "slides": {
        "category": "Presentations & Pitches",
        "keywords": ["slide", "presentasi", "pitch deck", "chart.js", "deck investor", "slide presentasi html", "keynote"],
        "summary": "Pembuatan presentasi interaktif berbasis web HTML menggunakan Chart.js, tipografi strategis, dan layout responsif.",
        "command": "Susun layout slide HTML mandiri dengan Chart.js dan keyboard navigation.",
        "path": ".agents/skills/slides/SKILL.md"
    },
    "skill-creator": {
        "category": "Meta & Tooling",
        "keywords": ["buat skill", "bikin skill", "edit skill", "optimasi skill", "skill baru", "eval skill", "benchmark skill", "package skill"],
        "summary": "Membuat, menguji, mengevaluasi akurasi pemicuan, dan memaketkan skill baru untuk ekosistem Antigravity.",
        "command": "Ikuti panduan SKILL.md skill-creator, gunakan eval loop dan package_skill.",
        "path": ".agents/skills/skill-creator/SKILL.md"
    }
}

def match_skills(query):
    query_lower = query.lower()
    scores = []
    
    for name, data in SKILLS_CATALOG.items():
        score = 0
        matched_keywords = []
        
        for kw in data["keywords"]:
            pattern = r'\b' + re.escape(kw.lower()) + r'\b' if len(kw) > 3 else re.escape(kw.lower())
            if re.search(pattern, query_lower):
                score += 15
                matched_keywords.append(kw)
            elif kw.lower() in query_lower:
                score += 8
                matched_keywords.append(kw)
                
        if name.lower() in query_lower:
            score += 40
            matched_keywords.append(f"exact:{name}")
            
        if score > 0:
            scores.append((name, score, matched_keywords, data))
            
    scores.sort(key=lambda x: x[1], reverse=True)
    return scores

def print_table():
    print("=" * 96)
    print(f"{'SKILL NAME':<24} | {'CATEGORY':<24} | {'CORE PURPOSE / QUICK ACTION':<44}")
    print("=" * 96)
    for name, data in sorted(SKILLS_CATALOG.items()):
        print(f"{name:<24} | {data['category']:<24} | {data['summary'][:42]}...")
    print("=" * 96)

def main():
    parser = argparse.ArgumentParser(description="Skills Router: Fast Skill Matcher & Token Saver")
    parser.add_argument("query", nargs="?", default="", help="User prompt or intent to route")
    parser.add_argument("--list", action="store_true", help="List all 21 available skills")
    parser.add_argument("--skill", type=str, help="Show compact detail for a specific skill")
    
    args = parser.parse_args()
    
    if args.list:
        print_table()
        return
        
    if args.skill:
        sk = SKILLS_CATALOG.get(args.skill)
        if not sk:
            print(f"Skill '{args.skill}' not found in catalog.")
            return
        print(f"\nSKILL: {args.skill}")
        print(f"Category : {sk['category']}")
        print(f"Summary  : {sk['summary']}")
        print(f"Command  : {sk['command']}")
        print(f"Path     : {sk['path']}\n")
        return
        
    if not args.query:
        print("Please provide a prompt query or use --list / --skill <name>")
        return
        
    results = match_skills(args.query)
    
    if not results:
        print("\nNo direct skill keyword match found. Recommended default pipeline:")
        print("1. Ideation / Discovery   -> brainstorming")
        print("2. Planning & Roadmap     -> writing-plans (.agents/plan/PLAN.md)")
        print("3. Execution              -> executing-plans (step-by-step)")
        print("4. Verification           -> verification-before-completion\n")
        return
        
    print(f"\n[SKILLS ROUTER] Matched {len(results)} skill(s) for query: \"{args.query}\"\n")
    for i, (name, score, kw, data) in enumerate(results[:3], 1):
        print(f"{i}. {name.upper()} (Relevance Score: {score})")
        print(f"   Category : {data['category']}")
        print(f"   Summary  : {data['summary']}")
        print(f"   Action   : {data['command']}")
        print(f"   File Ref : {data['path']}")
        print(f"   Matches  : {', '.join(kw[:4])}")
        print("-" * 70)
    print()

if __name__ == "__main__":
    main()

