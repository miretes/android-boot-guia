const stages = {
  rom: {
    title: "1. Boot ROM",
    tags: ["SoC", "hardware", "raíz de confianza"],
    body: "La Boot ROM es código inicial grabado por el fabricante del SoC. Su función general es arrancar una primera etapa confiable del cargador de arranque. La documentación pública de Android suele empezar la cadena en Boot ROM, pero los detalles concretos son específicos de chipset/fabricante.",
    evidence: ["No suele estar accesible como archivo del sistema Android.", "En pericial, no atribuir comportamiento Android a Boot ROM sin documentación del SoC.", "Punto conceptual de inicio de la cadena de confianza."],
    link: "https://source.android.com/docs/automotive/power/boot_time"
  },
  bootloader: {
    title: "2. Bootloader",
    tags: ["AVB", "A/B slot", "boot.img", "vbmeta"],
    body: "El bootloader inicializa memoria, verifica el dispositivo según Android Verified Boot, verifica particiones de arranque y, si hay actualizaciones A/B, determina el slot activo.",
    evidence: ["Estado locked/unlocked.", "Variables androidboot.* / bootconfig.", "Particiones boot, vendor_boot, init_boot, dtbo, vbmeta.", "Estado de verified boot."],
    link: "https://source.android.com/docs/core/architecture/bootloader"
  },
  kernel: {
    title: "3. Kernel Loading",
    tags: ["Linux kernel", "ramdisk", "GKI"],
    body: "El bootloader entrega el control al kernel Linux. En dispositivos modernos, el diseño puede incluir Generic Kernel Image, generic ramdisk, vendor_boot e init_boot, dependiendo de versión y lanzamiento del dispositivo.",
    evidence: ["boot.img / vendor_boot.img / init_boot.img.", "cmdline/bootconfig.", "fstab y ramdisk.", "Módulos imprescindibles para first-stage init."],
    link: "https://source.android.com/docs/core/architecture/partitions/generic-boot"
  },
  init1: {
    title: "4. First-stage init",
    tags: ["ramdisk", "mount", "system-as-root"],
    body: "First-stage init realiza tareas tempranas de montaje y transición al sistema. Android documenta que, en Android 10+, el montaje de la partición lógica system pasa a ser manejado por first-stage init en escenarios de dynamic partitions/system-as-root.",
    evidence: ["fstab de ramdisk/vendor.", "Mensajes tempranos de kernel/init.", "Montaje de system/vendor/product según diseño.", "Transición hacia el init del sistema."],
    link: "https://source.android.com/docs/core/architecture/partitions/system-as-root"
  },
  init2: {
    title: "5. Second-stage init",
    tags: ["SELinux", "init.rc", "services"],
    body: "La segunda fase de init carga políticas, lee scripts rc y arranca servicios organizados en clases. El lenguaje Android Init incluye acciones, comandos, servicios, opciones e imports.",
    evidence: ["init.rc e init.*.rc.", "Servicios con rutas anómalas.", "Propiedades persistentes.", "Clases main/core/late_start/vendor.", "Permisos, capabilities y sockets."],
    link: "https://android.googlesource.com/platform/system/core/+/master/init/README.md"
  },
  zygote: {
    title: "6. Zygote",
    tags: ["ART", "app_process", "System Server"],
    body: "Zygote es el proceso raíz de procesos de sistema y aplicaciones con la misma ABI. Es iniciado por init mediante scripts rc como init.zygote64.rc y prepara el entorno Android Runtime para forkear procesos.",
    evidence: ["init.zygote*.rc.", "Servicio zygote /system/bin/app_process64.", "Socket zygote.", "Relación con System Server y procesos app."],
    link: "https://source.android.com/docs/core/runtime/zygote"
  }
};

const timeline = [
  {
    title: "Boot ROM",
    bullets: [
      "Inicio desde código de solo lectura del SoC.",
      "Carga una etapa inicial del bootloader.",
      "Los detalles son específicos de hardware; Android documenta la cadena de arranque de forma general."
    ]
  },
  {
    title: "Bootloader",
    bullets: [
      "Inicializa memoria.",
      "Verifica el dispositivo siguiendo Android Verified Boot.",
      "Verifica particiones de arranque como boot, dtbo, init_boot y recovery cuando aplica.",
      "Si el dispositivo usa A/B, selecciona el slot activo."
    ]
  },
  {
    title: "Kernel Loading",
    bullets: [
      "Carga el kernel Linux y los ramdisks definidos por la arquitectura del dispositivo.",
      "En Android 12, boot puede incluir GKI y generic ramdisk; en Android 13+, el generic ramdisk se mueve a init_boot.",
      "El kernel arranca con parámetros procedentes del bootloader/bootconfig."
    ]
  },
  {
    title: "First-stage init",
    bullets: [
      "Ejecuta tareas mínimas desde ramdisk.",
      "Monta particiones necesarias para continuar el arranque.",
      "En dynamic partitions/system-as-root, asume parte del montaje que antes podía hacer el kernel.",
      "Transfiere a la copia de init del sistema cuando corresponde."
    ]
  },
  {
    title: "Second-stage init",
    bullets: [
      "Carga SELinux y procesa scripts init rc.",
      "Ejecuta acciones por triggers como on init, on boot y propiedades.",
      "Arranca servicios de clases como core, main o late_start.",
      "Gestiona sockets, permisos, usuarios, grupos y reinicios de servicios."
    ]
  },
  {
    title: "Zygote y System Server",
    bullets: [
      "init inicia zygote mediante app_process/app_process64.",
      "Zygote crea socket y prepara ART.",
      "Zygote arranca System Server y queda como raíz de procesos Java/Kotlin.",
      "Las aplicaciones se crean normalmente mediante fork desde Zygote."
    ]
  }
];

const sources = [
  ["Boot process overview", "source.android.com", "Cadena Boot ROM → Bootloader → Kernel → Init → Zygote → System Server.", "https://source.android.com/docs/automotive/power/boot_time"],
  ["Bootloader overview", "source.android.com", "Flujo de bootloader, verificación AVB, particiones de arranque y slot A/B.", "https://source.android.com/docs/core/architecture/bootloader"],
  ["Bootloader locking/unlocking", "source.android.com", "Estado locked/unlocked y propiedades relacionadas con verified boot.", "https://source.android.com/docs/core/architecture/bootloader/locking_unlocking"],
  ["Partitions overview", "source.android.com", "boot, init_boot, vbmeta, vendor y relación con Verified Boot.", "https://source.android.com/docs/core/architecture/partitions"],
  ["Generic boot partition", "source.android.com", "GKI, generic ramdisk, boot e init_boot en Android 12/13+.", "https://source.android.com/docs/core/architecture/partitions/generic-boot"],
  ["System-as-root / dynamic partitions", "source.android.com", "Papel de first-stage init en el montaje de particiones lógicas.", "https://source.android.com/docs/core/architecture/partitions/system-as-root"],
  ["Android Init Language", "android.googlesource.com", "README oficial de AOSP: acciones, comandos, servicios, opciones e imports.", "https://android.googlesource.com/platform/system/core/+/master/init/README.md"],
  ["AOSP init.rc", "android.googlesource.com", "Archivo init.rc real del árbol AOSP.", "https://android.googlesource.com/platform/system/core/+/master/rootdir/init.rc"],
  ["AOSP rootdir init zygote rc files", "android.googlesource.com", "Listado de init.zygote32.rc, init.zygote64.rc e init.zygote64_32.rc.", "https://android.googlesource.com/platform/system/core/+/master/rootdir/"],
  ["About Zygote processes", "source.android.com", "Descripción oficial de Zygote como raíz de procesos de sistema y apps.", "https://source.android.com/docs/core/runtime/zygote"]
];

const initSnippet = `# Fragmento didáctico inspirado en AOSP. Ver siempre el init.rc real del firmware.

import /system/etc/init/hw/init.${ro.zygote}.rc
import /system/etc/init/*.rc
import /vendor/etc/init/*.rc

on early-init
    # Etapa muy temprana: preparación mínima del entorno.
    start ueventd

on init
    # Acciones generales de inicialización.
    sysclktz 0
    mkdir /dev/socket 0755 root root
    mount cgroup none /acct nodev noexec nosuid

on boot
    # Acciones cuando se dispara el trigger boot.
    chmod 0666 /dev/null
    chown system system /dev/cpuctl

service servicemanager /system/bin/servicemanager
    class core
    user system
    group system readproc
    critical

service zygote /system/bin/app_process64 -Xzygote /system/bin --zygote --start-system-server
    class main
    user root
    group root readproc reserved_disk
    socket zygote stream 660 root system
    onrestart restart audioserver
    onrestart restart cameraserver`;

const explainItems = [
  ["imports", "Los imports cargan scripts rc adicionales. En AOSP existen ficheros específicos como init.zygote32.rc, init.zygote64.rc o init.zygote64_32.rc."],
  ["triggers", "Las secciones on early-init, on init y on boot son acciones activadas por triggers del lenguaje Android Init."],
  ["services", "service define un proceso gestionado por init: binario, clase, usuario, grupo, sockets y comportamiento al reinicio."],
  ["zygote", "Zygote se lanza con app_process/app_process64 y --zygote --start-system-server. El fichero exacto depende de ABI/configuración."],
  ["forense", "Para pericia, buscar servicios añadidos, rutas fuera de lo esperado, permisos excesivos, sockets anómalos y modificaciones en vendor/system init rc."]
];

function renderStage(key) {
  const s = stages[key];
  document.querySelectorAll(".node").forEach(n => n.classList.toggle("active", n.dataset.stage === key));
  document.getElementById("stageCard").innerHTML = `
    <h3>${s.title}</h3>
    <div class="stage-meta">${s.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
    <p>${s.body}</p>
    <h4>Evidencias / artefactos que pueden interesar</h4>
    <ul>${s.evidence.map(e => `<li>${e}</li>`).join("")}</ul>
    <p><a href="${s.link}" target="_blank" rel="noopener">Abrir documentación oficial ↗</a></p>
  `;
}

function renderTimeline() {
  document.getElementById("timelineContainer").innerHTML = timeline.map((item, i) => `
    <article class="timeline-item" data-step="${i + 1}">
      <h3>${item.title}</h3>
      <ul>${item.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
    </article>
  `).join("");
}

function renderCode() {
  document.getElementById("initCode").textContent = initSnippet;
  document.getElementById("codeExplain").innerHTML = `
    <h3>Lectura guiada</h3>
    ${explainItems.map(([k, v]) => `<button data-explain="${k}"><strong>${k}</strong><br>${v}</button>`).join("")}
    <p class="small">Nota: el ejemplo evita afirmar que todos los dispositivos usen exactamente estas líneas. Android varía por versión, ABI, particiones y fabricante.</p>
  `;
}

function renderSources() {
  document.getElementById("sources").innerHTML = sources.map(([title, domain, desc, url]) => `
    <article class="source-card">
      <p class="eyebrow">${domain}</p>
      <h3>${title}</h3>
      <p>${desc}</p>
      <a href="${url}" target="_blank" rel="noopener">Abrir fuente ↗</a>
    </article>
  `).join("");
}

document.querySelectorAll(".node").forEach(btn => btn.addEventListener("click", () => renderStage(btn.dataset.stage)));
renderStage("rom");
renderTimeline();
renderCode();
renderSources();
