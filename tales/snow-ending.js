export function createSnowEnding(s, b = "snowwhite") {
  const S = b === "mermaid",
    h = {
      mermaid: "\uC778\uC5B4\uACF5\uC8FC",
      snowwhite: "\uBC31\uC124\uACF5\uC8FC",
      cinderella: "\uC2E0\uB370\uB810\uB77C",
      redridinghood: "\uBE68\uAC04\uBAA8\uC790",
    },
    w = {
      mermaid: "LITTLEMERMAID",
      snowwhite: "SNOWWHITE",
      cinderella: "CINDERELLA",
      redridinghood: "REDRIDINGHOOD",
    },
    g = h[b] || h.snowwhite,
    v = w[b] || w.snowwhite,
    n = document.createElement("section");
  ((n.id = "snow-ending"),
    (n.className = "ending-interactive-surface"),
    (n.hidden = !0),
    n.setAttribute("aria-label", g + "\uAC00 \uB0A8\uAE34 \uC9C8\uBB38"));
  const A =
    {
      cinderella: [
        [
          "\uCE5C\uC808\uC740 \uC57D\uD568\uC77C\uAE4C\uC694?",
          "\uC7AC\uD22C\uC131\uC774\uB294 \uBAA8\uC695\uC744 \uB2F9\uD558\uBA74\uC11C\uB3C4 \uB098\uBB34\uC640 \uC0C8\uB4E4\uC5D0\uAC8C \uB9C8\uC74C\uC744 \uB0B4\uC5B4\uC90D\uB2C8\uB2E4<br><br>\uD0C0\uC778\uC758 \uC794\uC778\uD568\uC774 \uB098\uC758 \uB9C8\uC74C\uAE4C\uC9C0 \uC815\uD558\uAC8C \uB450\uC5B4\uC57C \uD560\uAE4C\uC694?",
        ],
        [
          "\uAD6C\uB450\uC5D0 \uB9DE\uCD94\uB824\uB358 \uAC83\uC740 \uBB34\uC5C7\uC774\uC5C8\uC744\uAE4C\uC694?",
          "\uC5B8\uB2C8\uB4E4\uC740 \uAD6C\uB450\uC5D0 \uBC1C\uC744 \uB9DE\uCD94\uB824\uACE0 \uC790\uC2E0\uC758 \uBAB8\uC744 \uD574\uCE69\uB2C8\uB2E4<br><br>\uB0A8\uC774 \uC815\uD55C \uC790\uB9AC\uC5D0 \uB4E4\uC5B4\uAC00\uB824\uACE0 \uB098 \uC790\uC2E0\uC744 \uC798\uB77C\uB0B4\uACE0 \uC788\uC9C0\uB294 \uC54A\uC740\uC9C0 \uBB3B\uAC8C \uB429\uB2C8\uB2E4",
        ],
        [
          "\uB3C4\uC6C0\uC740 \uC5B4\uB514\uC5D0\uC11C \uC654\uC744\uAE4C\uC694?",
          "\uC18C\uB140\uAC00 \uB3CC\uBCF8 \uB098\uBB34\uC640 \uACC1\uC5D0 \uC788\uB358 \uC0C8\uB4E4\uC774 \uC190\uC744 \uB0B4\uBC09\uB2C8\uB2E4<br><br>\uD63C\uC790 \uACAC\uB514\uB294 \uAC83\uACFC \uB3C4\uC6C0\uC744 \uBC1B\uC544\uB4E4\uC774\uB294 \uAC83\uC740 \uC11C\uB85C \uBC18\uB300\uB418\uB294 \uC77C\uC774 \uC544\uB2D9\uB2C8\uB2E4",
        ],
        [
          "\uC774 \uACB0\uB9D0\uC740 \uBAA8\uB450\uC5D0\uAC8C \uD589\uBCF5\uD588\uC744\uAE4C\uC694?",
          "\uACB0\uD63C\uC2DD\uC5D0\uC11C \uC5B8\uB2C8\uB4E4\uC740 \uB208\uC744 \uC783\uC2B5\uB2C8\uB2E4<br>\uADF8\uB9BC \uD615\uC81C\uC758 \uACB0\uB9D0\uC740 \uC18C\uB140\uC758 \uD589\uBCF5\uACFC \uD568\uAED8 \uC794\uC778\uD55C \uCC98\uBC8C\uC744 \uB0A8\uAE41\uB2C8\uB2E4<br><br>\uC798\uBABB\uC744 \uAC1A\uB294 \uBC29\uC2DD\uC5D0\uB3C4 \uB2E4\uB978 \uC120\uD0DD\uC774 \uC788\uC744\uAE4C\uC694?",
        ],
      ],
      redridinghood: [
        [
          "\uC704\uD5D8\uC740 \uC5B4\uB5A4 \uC5BC\uAD74\uB85C \uCC3E\uC544\uC654\uC744\uAE4C\uC694?",
          "\uB291\uB300\uB294 \uCC98\uC74C\uBD80\uD130 \uC774\uBE68\uC744 \uB4DC\uB7EC\uB0B4\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4<br>\uB2E4\uC815\uD55C \uB9D0\uB85C \uBAA9\uC801\uC9C0\uB97C \uBB3B\uACE0, \uC18C\uB140\uC758 \uBC1C\uAC78\uC74C\uC744 \uBC14\uAFC9\uB2C8\uB2E4<br><br>\uCE5C\uC808\uD55C \uB9D0\uACFC \uC548\uC804\uD55C \uD589\uB3D9\uC740 \uAC19\uC740 \uAC83\uC77C\uAE4C\uC694?",
        ],
        [
          "\uC65C \uB0AF\uC124\uB2E4\uB294 \uB290\uB08C\uC744 \uC9C0\uB098\uCCE4\uC744\uAE4C\uC694?",
          "\uC18C\uB140\uB294 \uBC29 \uC548\uC758 \uBAA8\uC2B5\uC774 \uC774\uC0C1\uD558\uB2E4\uB294 \uAC83\uC744 \uC54C\uC544\uCC28\uB9BD\uB2C8\uB2E4<br>\uD558\uC9C0\uB9CC \uC9C8\uBB38\uB9C8\uB2E4 \uB3CC\uC544\uC624\uB294 \uC775\uC219\uD55C \uB300\uB2F5\uC744 \uBBFF\uC2B5\uB2C8\uB2E4<br><br>\uC124\uBA85\uC774 \uC788\uC5B4\uB3C4 \uBD88\uD3B8\uD568\uC774 \uB0A8\uB294\uB2E4\uBA74, \uC7A0\uAE50 \uBA48\uCDB0\uB3C4 \uB429\uB2C8\uB2E4",
        ],
        [
          "\uC704\uD5D8\uC758 \uCC45\uC784\uC740 \uB204\uAD6C\uC5D0\uAC8C \uC788\uC744\uAE4C\uC694?",
          "\uAE38\uC744 \uBC97\uC5B4\uB09C \uC18C\uB140\uBCF4\uB2E4 \uBA3C\uC800 \uAE30\uC5B5\uD574\uC57C \uD560 \uAC83\uC740 \uC18D\uC774\uACE0 \uD574\uCE5C \uB291\uB300\uC758 \uC120\uD0DD\uC785\uB2C8\uB2E4<br><br>\uB204\uAD70\uAC00\uC758 \uD638\uAE30\uC2EC\uC774\uB098 \uC2E4\uC218\uAC00 \uD3ED\uB825\uC744 \uC815\uB2F9\uD558\uAC8C \uB9CC\uB4E4\uC9C0\uB294 \uC54A\uC2B5\uB2C8\uB2E4",
        ],
        [
          "\uB450 \uBC88\uC9F8 \uC232\uAE38\uC740 \uC65C \uB2EC\uB790\uC744\uAE4C\uC694?",
          "\uB2E4\uC2DC \uB291\uB300\uB97C \uB9CC\uB0AC\uC744 \uB54C \uC18C\uB140\uB294 \uD560\uBA38\uB2C8\uC5D0\uAC8C \uBA3C\uC800 \uC54C\uB9BD\uB2C8\uB2E4<br>\uB450 \uC0AC\uB78C\uC740 \uD63C\uC790 \uCC38\uB294 \uB300\uC2E0 \uD568\uAED8 \uB300\uBE44\uD569\uB2C8\uB2E4<br><br>\uACBD\uD5D8\uC744 \uB9D0\uD558\uACE0 \uB3C4\uC6C0\uC744 \uAD6C\uD558\uB294 \uC77C\uC774 \uB2E4\uC74C \uC774\uC57C\uAE30\uB97C \uBC14\uAFC9\uB2C8\uB2E4",
        ],
      ],
    }[b] ||
    (S
      ? [
          [
            "\uBAA9\uC18C\uB9AC\uB97C \uC783\uC740 \uACF5\uC8FC\uB294 \uBB34\uC5C7\uC744 \uB0A8\uAE38\uAE4C\uC694?",
            "\uACF5\uC8FC\uB294 \uB2E4\uB9AC\uB97C \uC5BB\uC9C0\uB9CC, \uC790\uC2E0\uC758 \uC774\uC57C\uAE30\uB97C \uC804\uD560 \uBAA9\uC18C\uB9AC\uB97C \uC783\uC2B5\uB2C8\uB2E4<br><br>\uB2E4\uB978 \uC0AC\uB78C\uC758 \uC138\uC0C1\uC5D0 \uB4E4\uC5B4\uAC00\uAE30 \uC704\uD574 \uB098\uC758 \uBB34\uC5C7\uC744 \uB0B4\uC5B4\uC8FC\uACE0 \uC788\uB294\uC9C0 \uB3CC\uC544\uBCF4\uAC8C \uD558\uB294 \uC7A5\uBA74\uC785\uB2C8\uB2E4",
          ],
          [
            "\uC655\uC790\uB97C \uAD6C\uD55C \uC0AC\uB78C\uC740 \uC65C \uC54C\uB824\uC9C0\uC9C0 \uC54A\uC558\uC744\uAE4C\uC694?",
            "\uC655\uC790\uB294 \uC790\uC2E0\uC774 \uB208\uC744 \uB5B4\uC744 \uB54C \uACC1\uC5D0 \uC788\uB358 \uC0AC\uB78C\uC744 \uAE30\uC5B5\uD569\uB2C8\uB2E4<br>\uADF8 \uC774\uC804\uC758 \uD30C\uB3C4 \uC18D\uC5D0\uC11C \uB204\uAC00 \uC790\uC2E0\uC744 \uBD99\uC7A1\uC558\uB294\uC9C0\uB294 \uC54C\uC9C0 \uBABB\uD569\uB2C8\uB2E4<br><br>\uBCF4\uC774\uB294 \uC7A5\uBA74\uB9CC\uC73C\uB85C \uD55C \uC0AC\uB78C\uC758 \uB9C8\uC74C\uC744 \uBAA8\uB450 \uC54C \uC218 \uC788\uC744\uAE4C\uC694?",
          ],
          [
            "\uACF5\uC8FC\uB294 \uC65C \uB9C8\uC9C0\uB9C9\uC5D0 \uCE7C\uC744 \uB358\uC84C\uC744\uAE4C\uC694?",
            "\uC655\uC790\uB97C \uD574\uCE58\uBA74 \uB3CC\uC544\uAC08 \uC218 \uC788\uC5C8\uC9C0\uB9CC, \uACF5\uC8FC\uB294 \uADF8 \uAE38\uC744 \uD0DD\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4<br><br>\uC790\uC2E0\uC758 \uC0C1\uCC98\uB97C \uB2E4\uB978 \uC0AC\uB78C\uC5D0\uAC8C \uB3CC\uB824\uC8FC\uB294 \uB300\uC2E0 \uBA48\uCD98 \uC120\uD0DD<br>\uC774 \uC774\uC57C\uAE30\uC758 \uB9C8\uC9C0\uB9C9\uC740 \uADF8 \uC190\uB05D\uC5D0\uC11C \uB2EC\uB77C\uC9D1\uB2C8\uB2E4",
          ],
          [
            "\uAC70\uD488\uC740 \uBAA8\uB4E0 \uAC83\uC758 \uB05D\uC77C\uAE4C\uC694?",
            "\uACF5\uC8FC\uAC00 \uBC14\uB77C\uB358 \uACB0\uD63C\uC73C\uB85C \uB05D\uB098\uC9C0\uB294 \uC54A\uC2B5\uB2C8\uB2E4<br>\uD558\uC9C0\uB9CC \uAC70\uD488 \uB4A4\uC5D0\uB294 \uACF5\uAE30\uC758 \uB538\uB4E4\uACFC \uD568\uAED8\uD558\uB294 \uB2E4\uB978 \uAE38\uC774 \uC5F4\uB9BD\uB2C8\uB2E4<br><br>\uBC14\uB77C\uB358 \uACB0\uB9D0\uC744 \uC783\uC740 \uB4A4\uC5D0\uB3C4 \uC774\uC57C\uAE30\uB294 \uC774\uC5B4\uC9C8 \uC218 \uC788\uC744\uAE4C\uC694?",
          ],
        ]
      : [
          [
            "\uBC31\uC124\uACF5\uC8FC\uB294 \uC6B0\uB9AC\uC5D0\uAC8C \uBB34\uC5C7\uC744 \uB0A8\uAE38\uAE4C\uC694?",
            "\uC544\uB984\uB2F5\uB2E4\uB294 \uB300\uB2F5 \uD558\uB098\uAC00 \uC655\uBE44\uC5D0\uAC8C\uB294 \uB204\uAD70\uAC00\uB97C \uD574\uCE60 \uC774\uC720\uAC00 \uB429\uB2C8\uB2E4<br><br>\uC774 \uC774\uC57C\uAE30\uB294 \uC544\uB984\uB2E4\uC6C0\uBCF4\uB2E4, \uBE44\uAD50\uAC00 \uC6B0\uB9AC\uC758 \uB9C8\uC74C\uC744 \uC5B4\uB514\uAE4C\uC9C0 \uB370\uB824\uAC00\uB294\uC9C0 \uBB3B\uB294 \uC774\uC57C\uAE30\uB85C \uC77D\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4",
          ],
          [
            "\uC655\uBE44\uB294 \uC65C \uAC70\uC6B8\uC758 \uB300\uB2F5\uC5D0 \uB9E4\uB2EC\uB838\uC744\uAE4C\uC694?",
            "\uC655\uBE44\uB294 \uC790\uC2E0\uC774 \uAC00\uC9C4 \uAC83\uBCF4\uB2E4 \uB204\uAC00 \uB354 \uC544\uB984\uB2E4\uC6B4\uC9C0\uB97C \uD655\uC778\uD569\uB2C8\uB2E4<br>\uAC70\uC6B8\uC774 \uBC14\uB010 \uAC83\uC774 \uC544\uB2C8\uB77C, \uB2E4\uB978 \uC0AC\uB78C\uC744 \uBC14\uB77C\uBCF4\uB294 \uC655\uBE44\uC758 \uB9C8\uC74C\uC774 \uC810\uC810 \uC5B4\uB450\uC6CC\uC9C4 \uAC83\uC740 \uC544\uB2D0\uAE4C\uC694",
          ],
          [
            "\uC65C \uB0AF\uC120 \uCE5C\uC808\uC740 \uC138 \uBC88 \uCC3E\uC544\uC654\uC744\uAE4C\uC694?",
            "\uD5C8\uB9AC\uB048\uACFC \uBE57, \uADF8\uB9AC\uACE0 \uC0AC\uACFC<br>\uC704\uD5D8\uC740 \uB9E4\uBC88 \uB2E4\uB978 \uBAA8\uC2B5\uACFC \uB2E4\uC815\uD55C \uB9D0\uB85C \uBB38 \uC55E\uC5D0 \uC12D\uB2C8\uB2E4<br><br>\uCE5C\uC808\uD55C \uB9D0\uC774 \uBD88\uD3B8\uD55C \uC120\uD0DD\uC744 \uC7AC\uCD09\uD55C\uB2E4\uBA74, \uC7A0\uAE50 \uBA48\uCD94\uACE0 \uACC1\uC5D0 \uC788\uB294 \uC0AC\uB78C\uACFC \uD568\uAED8 \uD310\uB2E8\uD574\uB3C4 \uB429\uB2C8\uB2E4",
          ],
          [
            "\uC655\uBE44\uC758 \uCC98\uBC8C\uB85C \uBAA8\uB4E0 \uAC83\uC774 \uB05D\uB0AC\uC744\uAE4C\uC694?",
            "\uC1E0\uAD6C\uB450\uB294 \uC655\uBE44\uC758 \uC774\uC57C\uAE30\uB97C \uB05D\uB0C5\uB2C8\uB2E4<br>\uD558\uC9C0\uB9CC \uD3ED\uB825\uC73C\uB85C \uB05D\uB09C \uACB0\uB9D0\uC774 \uC815\uB9D0 \uD589\uBCF5\uD55C \uACB0\uB9D0\uC778\uC9C0\uB294 \uB2E4\uB978 \uC9C8\uBB38\uC785\uB2C8\uB2E4<br><br>\uB2F9\uC2E0\uC774\uB77C\uBA74 \uC774 \uC774\uC57C\uAE30\uC758 \uB9C8\uC9C0\uB9C9\uC744 \uC5B4\uB5BB\uAC8C \uC4F0\uACE0 \uC2F6\uB098\uC694?",
          ],
        ]);
  ((n.innerHTML = `<section class="ending-faq"><div class="faq-layout"><p class="faq-aside">(\uC774\uC57C\uAE30\uAC00 \uB0A8\uAE34 \uC9C8\uBB38\uB4E4)</p><div class="faq-list">${A.map(([e, t], r) => `<article class="faq-item"><h3><button type="button" aria-expanded="false" aria-controls="snow-answer-${r}">${e}<span aria-hidden="true">\uFF0B</span></button></h3><div class="faq-answer" id="snow-answer-${r}" inert><div><p>${t}</p></div></div></article>`).join("")}</div></div></section><footer class="redhood-ending-footer"><div class="ending-letter-word" aria-label="${g}"></div><div class="ending-footer-bottom"><span>DARK FAIRY TALE</span><a href="#" id="snow-restart">\uCC98\uC74C\uBD80\uD130 \uB2E4\uC2DC \uC77D\uAE30</a><span>THE END OF THIS TALE / THE BEGINNING OF YOURS</span></div></footer>`),
    document.body.append(n));
  const o = document.createElement("p");
  ((o.id = "snow-ending-hint"),
    (o.textContent =
      "\uC2A4\uD06C\uB864\uD574\uC11C \uC774\uC57C\uAE30\uAC00 \uB0A8\uAE34 \uC9C8\uBB38\uC73C\uB85C"),
    (o.hidden = !0),
    s.append(o));
  let d = !1,
    m = 0,
    c = !1;
  const y = matchMedia("(prefers-reduced-motion:reduce)").matches,
    E = [...n.querySelectorAll(".faq-item")];
  for (const e of E) {
    const t = e.querySelector("button");
    t.addEventListener("click", () => {
      const r = t.getAttribute("aria-expanded") !== "true";
      for (const i of E) {
        const a = i === e && r;
        (i.classList.toggle("is-open", a),
          i.querySelector("button").setAttribute("aria-expanded", String(a)),
          (i.querySelector(".faq-answer").inert = !a),
          (i.querySelector("button span").textContent = a
            ? "\u2212"
            : "\uFF0B"));
      }
    });
  }
  const l = n.querySelector(".ending-letter-word");
  for (const e of v) {
    let a = function (u) {
      const q = getComputedStyle(r).transform;
      if ((i?.cancel(), y)) {
        r.style.transform = u ? "scale(.8) scaleY(1.55)" : "scaleY(1.55)";
        return;
      }
      i = r.animate(
        u
          ? [
              { transform: q },
              { transform: "translateY(16px) scale(.10) scaleY(1.55)" },
            ]
          : [
              { transform: q, offset: 0, easing: "cubic-bezier(.16,1,.3,1)" },
              {
                transform: "translateY(-3px) scale(1.12) scaleY(1.55)",
                offset: 0.62,
                easing: "cubic-bezier(.35,0,.2,1)",
              },
              { transform: "translateY(0) scale(1) scaleY(1.55)", offset: 1 },
            ],
        {
          duration: u ? 330 : 1650,
          easing: u ? "cubic-bezier(.3,.05,.5,1)" : "linear",
          fill: "forwards",
        },
      );
    };
    const t = document.createElement("span");
    ((t.className = "ending-letter"),
      t.setAttribute("aria-hidden", "true"),
      (t.innerHTML = "<span>" + e + "</span>"),
      l.append(t));
    const r = t.firstElementChild;
    let i = null;
    (t.addEventListener("pointerenter", () => a(!0)),
      t.addEventListener("pointerleave", () => a(!1)));
  }
  const L = document.createElement("canvas").getContext("2d");
  function f() {
    L.font = '900 100px "Arial Black", Arial, sans-serif';
    const e = [...v].reduce((t, r) => t + L.measureText(r).width, 0);
    (l.clientWidth && (l.style.fontSize = (l.clientWidth / e) * 100 + "px"),
      p());
  }
  (new ResizeObserver(f).observe(l), document.fonts.ready.then(f));
  function T() {
    if (((m = 0), !d)) return;
    const e = Math.max(0, Math.min(1, scrollY / (innerHeight * 0.95)));
    (e > 0.97 && (c = !0),
      e < 0.25 && (c = !1),
      (s.style.transform = `translateY(${-e * innerHeight * 0.88}px) scale(${1 - e * 0.17})`),
      (s.style.borderRadius = e * 28 + "px"),
      (s.style.opacity = c ? "0" : String(1 - Math.max(0, (e - 0.65) / 0.35))),
      (s.inert = c || e > 0.8),
      document.body.classList.toggle("snow-ending-open", c || e > 0.5),
      (o.style.opacity = String(1 - e * 3)));
  }
  function p() {
    m || (m = requestAnimationFrame(T));
  }
  (addEventListener("scroll", p, { passive: !0 }),
    addEventListener("resize", f),
    n.addEventListener(
      "pointermove",
      (e) =>
        document.body.classList.toggle(
          "ending-passive",
          !e.target.closest("a,button,.ending-letter"),
        ),
      { passive: !0 },
    ),
    n.addEventListener("pointerleave", () =>
      document.body.classList.remove("ending-passive"),
    ));
  const x = {
    get ready() {
      return d;
    },
    open() {
      d &&
        window.scrollTo({
          top: innerHeight,
          behavior: y ? "instant" : "smooth",
        });
    },
    setReady(e) {
      e !== d &&
        ((d = e),
        (n.hidden = o.hidden = !e),
        document.body.classList.toggle("snow-lesson-ready", e),
        e
          ? (f(), p())
          : ((c = !1),
            window.scrollTo({ top: 0, behavior: "instant" }),
            (s.style.transform = ""),
            (s.style.opacity = ""),
            (s.style.borderRadius = ""),
            (s.inert = !1),
            document.body.classList.remove(
              "snow-ending-open",
              "ending-passive",
            )));
    },
  };
  return {
    ...x,
    get ready() {
      return d;
    },
    onRestart(e) {
      n.querySelector("#snow-restart").addEventListener("click", (t) => {
        (t.preventDefault(), x.setReady(!1), e());
      });
    },
  };
}
