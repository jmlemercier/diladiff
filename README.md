# DiLaDiff project page

Static project page for **DiLaDiff: Distilled Latent-Augmented Diffusion for Language Modeling**,
hosted on GitHub Pages at <https://jmlemercier.github.io/diladiff/>.

## Structure

```
.
├── index.html              # Main page (hero, abstract, walkthrough, results, bibtex)
├── .nojekyll               # Disable Jekyll on GitHub Pages
├── css/
│   └── style.css           # Theme tokens (light + dark) and stepper styling
├── js/
│   ├── theme.js            # Light/dark toggle, persists in localStorage
│   └── stepper.js          # Method-walkthrough stepper (prev/next, dots, ← →)
└── assets/
    ├── DiLaDiff.pdf            # Paper PDF
    ├── architecture.png        # Hero figure (also Figure 1 in the paper)
    ├── figure1-paper.png       # Paper Figure 1 with caption (archival)
    ├── method/                 # Stepper slides 1–4 (incremental auto-encoder)
    │   ├── step-1.png
    │   ├── step-2.png
    │   ├── step-3.png
    │   └── step-4.png
    └── results/
        └── pareto.png          # Speed-quality Pareto frontier (Figure 2)
```

## Local preview

```bash
cd /path/to/diladiff
python3 -m http.server 8000
# then open http://localhost:8000/
```

If you're working on a remote server over SSH, forward the port:

```bash
ssh -L 8000:localhost:8000 user@host
```

## Updating assets

Source PDFs are not tracked here. To regenerate the stepper slides and the architecture hero
from the slide deck, render pages 20 and 22–25 of `Jean-Marie Lemercier - DiLaDiff.pdf`
with `pdftoppm -r 220` and crop the bottom NVIDIA-confidential strip
(~4% of the page height). Figure 2 (Pareto) is rendered from slide 54 the same way.

## Deploying

This is a vanilla `username.github.io/<repo>` GitHub Pages site. Push `main` to
`github.com/jmlemercier/diladiff` and enable Pages → "Deploy from a branch" → `main` / `/ (root)`.

## Rebuttal figure refresh (November 2026)

The selected archive figures replace the slide screenshots in `assets/results/`:

| Website asset | Archived source PNG |
| --- | --- |
| `ladiff-1.png` | `diladiff_bs1_two_panel_linear_throughput.png` |
| `ladiff-2.png` | `diladiff_temperature_nucleus_consistent.png` |
| `ladiff-3.png` | `diladiff_confidence_sampling_consistent.png` |
| `pareto.png` | `diladiff_paper_two_panel_linear_throughput.png` |

Source package: `diladiff-final-archive/figures/` in the paper handoff archive.
The figures share MDLM orange circles, LaDiff green triangles, and DiLaDiff purple diamonds. GenPPL axes are inverted. Throughput coordinates were reconstructed from the supplied/published figures; they are not raw timing records. The eight MDLM confidence points were reconstructed from published Figure 9; the other 24 confidence-comparison points match saved metrics. The source Figure 9 caption reports Ncont=200 while matched LaDiff configs store 100 solver steps; continuous-NFE counting remains unverified, so the website caption omits this ambiguous count.

The prior slide-based instructions above continue to apply to the unchanged architecture, method, latent-space, and distillation figures.
