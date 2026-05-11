(() => {
  const printMode = Boolean(window.__PRINT_MODE__);

  const splitWords = () => {
    document.querySelectorAll(".split-words").forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map((word) => `<span class="word"><span>${word}</span></span>`).join(" ");
    });
  };

  const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(Math.round(value));

  const runCounters = () => {
    document.querySelectorAll("[data-count]").forEach((counter) => {
      const target = Number(counter.dataset.count);
      gsap.fromTo(counter, { innerText: 0 }, {
        innerText: target,
        duration: 1.8,
        ease: "power3.out",
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: counter,
          start: "top 82%",
          once: true,
        },
        onUpdate() {
          counter.textContent = formatNumber(Number(counter.innerText));
        },
      });
    });
  };

  const initParticles = () => {
    if (!window.particlesJS || printMode) return;
    particlesJS("particles-js", {
      particles: {
        number: { value: 78, density: { enable: true, value_area: 900 } },
        color: { value: ["#d8d8d8", "#ff98a1", "#777777"] },
        shape: { type: "circle" },
        opacity: { value: 0.36, random: true },
        size: { value: 2.7, random: true },
        line_linked: { enable: true, distance: 135, color: "#f7838d", opacity: 0.12, width: 1 },
        move: { enable: true, speed: 1.2, direction: "none", random: true, out_mode: "out" },
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "repulse" }, resize: true },
        modes: { repulse: { distance: 110, duration: 0.4 } },
      },
      retina_detect: true,
    });
  };

  const initCompetitiveCharts = () => {
    const radarCanvas = document.getElementById("competitorRadar");
    const barCanvas = document.getElementById("competitorBar");
    const toggleRoot = document.getElementById("datasetToggles");
    const panel = radarCanvas?.closest(".compete-panel");
    const viewRadar = document.querySelector('[data-chart-view="radar"]');
    const viewBar = document.querySelector('[data-chart-view="bar"]');
    const scatterCanvas = document.getElementById("competitorScatter");
    const viewScatter = document.querySelector('[data-chart-view="scatter"]');
    const tabs = document.querySelectorAll(".chart-tab");

    if (!radarCanvas || !barCanvas || !scatterCanvas || !toggleRoot || !panel || !window.Chart || !viewRadar || !viewBar || !viewScatter)
      return;

    const labels = [
      "Công nghệ EdTech",
      "Tương tác Micro-size",
      "Học phí tối ưu",
      "Tính thực chiến HSK 3.0",
      "Cam kết hoàn tiền",
    ];

    const datasetDefs = [
      {
        slug: "aoec",
        label: "AOEC",
        data: [94, 96, 91, 95, 90],
        accent: "#ff4d6d",
        borderColor: "#ff4d6d",
        fillRadar: "rgba(255, 77, 109, 0.32)",
        fillBar: "rgba(255, 77, 109, 0.88)",
        pointBg: "#ffb3c6",
        borderW: 3,
        borderDash: undefined,
      },
      {
        slug: "thanhmai",
        label: "ThanhMaiHSK",
        data: [78, 62, 66, 84, 56],
        accent: "#22d3ee",
        borderColor: "#22d3ee",
        fillRadar: "rgba(34, 211, 238, 0.22)",
        fillBar: "rgba(34, 211, 238, 0.82)",
        pointBg: "#a5f3fc",
        borderW: 2,
        borderDash: [10, 6],
      },
      {
        slug: "pengyou",
        label: "Pengyou",
        data: [63, 74, 70, 69, 48],
        accent: "#fbbf24",
        borderColor: "#fbbf24",
        fillRadar: "rgba(251, 191, 36, 0.22)",
        fillBar: "rgba(251, 191, 36, 0.85)",
        pointBg: "#fde68a",
        borderW: 2,
        borderDash: [4, 4],
      },
      {
        slug: "khanhvan",
        label: "Khánh Vân",
        data: [54, 58, 76, 61, 42],
        accent: "#a855f7",
        borderColor: "#a855f7",
        fillRadar: "rgba(168, 85, 247, 0.2)",
        fillBar: "rgba(168, 85, 247, 0.78)",
        pointBg: "#e9d5ff",
        borderW: 2,
        borderDash: [2, 3],
      },
    ];

    const radarDatasets = datasetDefs.map((d, i) => ({
      label: d.label,
      data: d.data,
      borderColor: d.borderColor,
      backgroundColor: d.fillRadar,
      borderWidth: d.borderW,
      pointBackgroundColor: d.pointBg,
      pointBorderColor: "#070707",
      pointBorderWidth: 2,
      pointRadius: i === 0 ? 7 : 5,
      pointHoverRadius: i === 0 ? 9 : 7,
      ...(d.borderDash ? { borderDash: d.borderDash } : {}),
    }));

    const barDatasets = datasetDefs.map((d) => ({
      label: d.label,
      data: d.data,
      borderColor: d.borderColor,
      backgroundColor: d.fillBar,
      borderWidth: 2,
      borderRadius: 6,
    }));

    const commonPlugins = {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(10,10,12,0.92)",
        titleColor: "#fff",
        bodyColor: "rgba(255,255,255,0.88)",
        borderColor: "rgba(247,131,141,0.45)",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label(ctx) {
            const v = ctx.raw;
            return ` ${ctx.dataset.label}: ${v}`;
          },
        },
      },
    };

    let radarChart;
    let barChart;
    let scatterChart;

    const anim = { duration: printMode ? 0 : 1400, easing: "easeOutQuart" };

    const createRadar = () => {
      if (radarChart) return;
      radarChart = new Chart(radarCanvas.getContext("2d"), {
        type: "radar",
        data: { labels, datasets: radarDatasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: anim,
          interaction: { mode: "nearest", intersect: false },
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: {
                display: true,
                stepSize: 25,
                color: "rgba(255,255,255,0.28)",
                backdropColor: "transparent",
                showLabelBackdrop: false,
                font: { size: 10, family: "Muli" },
              },
              grid: { color: "rgba(255,255,255,0.12)" },
              angleLines: { color: "rgba(255,255,255,0.14)" },
              pointLabels: {
                color: "#f4f4f5",
                font: { family: "Muli", size: 12, weight: "800" },
                padding: 10,
              },
            },
          },
          plugins: commonPlugins,
        },
      });
    };

    const scatterDatasets = [
      {
        label: "AOEC",
        data: [{ x: 46, y: 93 }],
        accent: "#ff4d6d",
        pointRadius: 10,
      },
      {
        label: "ThanhMaiHSK",
        data: [{ x: 22, y: 76 }],
        accent: "#22d3ee",
        pointRadius: 8,
      },
      {
        label: "Pengyou",
        data: [{ x: 78, y: 54 }],
        accent: "#fbbf24",
        pointRadius: 8,
      },
      {
        label: "Khánh Vân",
        data: [{ x: 30, y: 58 }],
        accent: "#a855f7",
        pointRadius: 8,
      },
    ].map((d) => ({
      label: d.label,
      data: d.data,
      backgroundColor: d.accent,
      borderColor: "#0e0e0f",
      borderWidth: 2,
      pointRadius: d.pointRadius,
      pointHoverRadius: d.pointRadius + 3,
    }));

    const createScatter = () => {
      if (scatterChart) return;
      scatterChart = new Chart(scatterCanvas.getContext("2d"), {
        type: "scatter",
        data: { datasets: scatterDatasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: anim,
          scales: {
            x: {
              min: 0,
              max: 100,
              grid: { color: "rgba(255,255,255,0.08)" },
              ticks: {
                display: false,
                color: "rgba(255,255,255,0.65)",
              },
              title: {
                display: true,
                text: "◄ Học thuật / luyện đề truyền thống — Tiếp cận viral & giải trí MXH ►",
                color: "rgba(255,255,255,0.75)",
                font: { family: "Muli", size: 11, weight: "700" },
                padding: { top: 6, bottom: 0 },
              },
            },
            y: {
              min: 0,
              max: 100,
              grid: { color: "rgba(255,255,255,0.08)" },
              ticks: {
                display: false,
                color: "rgba(255,255,255,0.65)",
              },
              title: {
                display: true,
                text: "Thực chiến · phản xạ · đầu ra ◄————————————————► Ít nhấn mạnh cam kết thực tế",
                color: "rgba(255,255,255,0.75)",
                font: { family: "Muli", size: 11, weight: "700" },
                padding: { bottom: 6 },
              },
            },
          },
          plugins: {
            ...commonPlugins,
            legend: {
              display: true,
              labels: {
                color: "rgba(255,255,255,0.86)",
                font: { family: "Muli", size: 11, weight: "700" },
                boxWidth: 10,
              },
              position: "bottom",
            },
            tooltip: {
              ...commonPlugins.tooltip,
              callbacks: {
                label(ctx) {
                  const { datasetIndex, parsed } = ctx;
                  const name = scatterDatasets[datasetIndex].label;
                  return ` ${name}: định vị (x:${Math.round(parsed.x)}, y:${Math.round(parsed.y)})`;
                },
              },
            },
          },
        },
      });
    };

    const createBar = () => {
      if (barChart) return;
      barChart = new Chart(barCanvas.getContext("2d"), {
        type: "bar",
        data: { labels, datasets: barDatasets },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          animation: anim,
          interaction: { mode: "index", intersect: false },
          datasets: {
            bar: { maxBarThickness: 12 },
          },
          scales: {
            x: {
              min: 0,
              max: 100,
              grid: { color: "rgba(255,255,255,0.08)" },
              ticks: {
                color: "rgba(255,255,255,0.55)",
                font: { family: "Muli", size: 11 },
                callback(value) {
                  return `${value}`;
                },
              },
            },
            y: {
              grid: { display: false },
              ticks: {
                color: "rgba(255,255,255,0.88)",
                font: { family: "Muli", size: 11, weight: "800" },
              },
            },
          },
          plugins: commonPlugins,
        },
      });
    };

    const buildToggles = () => {
      toggleRoot.innerHTML = "";
      datasetDefs.forEach((d, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "dataset-toggle is-on";
        btn.dataset.brand = d.slug;
        btn.style.borderLeft = `4px solid ${d.accent}`;
        btn.textContent = d.label;
        btn.setAttribute("aria-pressed", "true");
        btn.addEventListener("click", () => {
          if (!radarChart) return;
          const next = !radarChart.isDatasetVisible(i);
          radarChart.setDatasetVisibility(i, next);
          if (barChart) barChart.setDatasetVisibility(i, next);
          btn.classList.toggle("is-on", next);
          btn.setAttribute("aria-pressed", next ? "true" : "false");
          radarChart.update();
          if (barChart) barChart.update();
        });
        toggleRoot.appendChild(btn);
      });
    };

    const setMode = (mode) => {
      const showRadar = mode === "radar";
      const showBar = mode === "bar";
      const showScatter = mode === "scatter";
      viewRadar.hidden = !showRadar;
      viewBar.hidden = !showBar;
      viewScatter.hidden = !showScatter;
      toggleRoot.style.display = showScatter ? "none" : "flex";

      createRadar();

      tabs.forEach((t) => {
        const active = t.dataset.chartMode === mode;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });

      requestAnimationFrame(() => {
        if (showBar) {
          createBar();
          barChart?.resize();
        }
        if (showScatter) {
          createScatter();
          scatterChart?.resize();
        }
        radarChart?.resize();
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => setMode(tab.dataset.chartMode));
    });

    const boot = () => {
      createRadar();
      buildToggles();
      setMode("radar");
    };

    if (printMode) {
      boot();
    } else {
      ScrollTrigger.create({
        trigger: panel,
        start: "top 82%",
        once: true,
        onEnter: boot,
      });
    }
  };

  const initAnimations = () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    splitWords();

    gsap.to(".progress-bar", {
      width: "100%",
      ease: "none",
      scrollTrigger: { scrub: 0.25, start: 0, end: "max" },
    });

    gsap.to("#hero .word span, #closing .word span", {
      y: 0,
      duration: 1,
      ease: "power4.out",
      stagger: 0.045,
      delay: 0.15,
    });

    gsap.utils.toArray(".reveal-up").forEach((el) => {
      gsap.from(el, {
        y: 52,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 84%" },
      });
    });

    gsap.utils.toArray(".reveal-card").forEach((el, index) => {
      gsap.from(el, {
        y: 70,
        x: index % 2 ? 36 : -36,
        rotate: index % 2 ? 2 : -2,
        opacity: 0,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%" },
      });
    });

    if (!printMode && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".phase-detail-slide").forEach((slide) => {
        const wm = slide.querySelector(".phase-watermark");
        if (wm) {
          gsap.fromTo(
            wm,
            { x: 0, y: 0 },
            {
              x: "-4vw",
              y: "5vh",
              ease: "none",
              scrollTrigger: {
                trigger: slide,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.15,
              },
            },
          );
        }
      });
    }

    gsap.utils.toArray(".slide").forEach((section) => {
      gsap.fromTo(section, { "--glow": 0 }, {
        "--glow": 1,
        scrollTrigger: { trigger: section, start: "top 55%", end: "bottom 45%", scrub: true },
      });
    });

    gsap.to(".hero-mascot-wrap .hero-mascot", {
      y: -28,
      rotate: -3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      duration: 3.8,
    });

    const barChartRoot = document.querySelector(".bar-chart");
    if (barChartRoot) {
      gsap.to(".bar-chart i", {
        width: (i, el) => el.style.getPropertyValue("--w"),
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: barChartRoot, start: "top 78%", once: true },
      });
    }

    runCounters();
    initCompetitiveCharts();
  };

  const initTilt = () => {
    if (window.VanillaTilt && !printMode) {
      VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
        max: 11,
        speed: 700,
        glare: true,
        "max-glare": 0.22,
        scale: 1.02,
      });
    }
  };

  const initLucideIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  };

  const initDeckNavActive = () => {
    const nav = document.querySelector(".deck-nav");
    const deck = document.getElementById("deck");
    if (!nav || !deck || printMode) return;

    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const hrefSet = new Set(links.map((a) => a.getAttribute("href")));
    const sections = [...deck.querySelectorAll(":scope > section[id]")].filter((s) =>
      hrefSet.has(`#${s.id}`)
    );
    if (!sections.length) return;

    const markerY = () => window.innerHeight * 0.36;

    const apply = () => {
      const marker = markerY();
      const scrollBottom = window.scrollY + window.innerHeight;
      const docBottom = document.documentElement.scrollHeight;
      const nearBottom = scrollBottom >= docBottom - 6;

      let current = sections[0];
      if (nearBottom) {
        current = sections[sections.length - 1];
      } else {
        for (const sec of sections) {
          const top = sec.getBoundingClientRect().top;
          if (top <= marker) current = sec;
          else break;
        }
      }

      const href = `#${current.id}`;
      links.forEach((a) => {
        const on = a.getAttribute("href") === href;
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    };

    let ticking = false;
    const schedule = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        apply();
      });
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
  };

  window.addEventListener("DOMContentLoaded", () => {
    initLucideIcons();
    initParticles();
    initAnimations();
    initDeckNavActive();
    initTilt();

    if (printMode) {
      setTimeout(() => {
        document.querySelectorAll("[data-count]").forEach((el) => {
          el.textContent = formatNumber(Number(el.dataset.count));
        });
        document.querySelectorAll(".bar-chart i").forEach((el) => {
          el.style.width = el.style.getPropertyValue("--w");
        });
      }, 500);
    }
  });
})();
