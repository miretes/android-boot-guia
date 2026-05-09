const stages={rom:{title:'Boot ROM',tags:['SoC','primer código','hardware'],text:'Código inicial almacenado en el SoC. Su papel general es comenzar la cadena de arranque y transferir ejecución a una primera etapa del bootloader. Los detalles exactos dependen del fabricante del chip.',bullets:['Arranca antes de Android.','No es un componente de userspace Android.','Suele formar parte de la raíz inicial de confianza.'],link:'https://source.android.com/docs/automotive/power/boot_time'},bl:{title:'Bootloader',tags:['AVB','slots A/B','boot images'],text:'Inicializa memoria, decide modo normal/recovery, verifica el estado de arranque y carga imágenes como boot.img, vendor_boot.img e init_boot.img cuando existen.',bullets:['Determina si debe arrancar recovery.','Carga kernel y ramdisks.','Comunica verified boot state mediante cmdline o bootconfig.','En dispositivos A/B selecciona slot activo.'],link:'https://source.android.com/docs/core/architecture/bootloader'},kernel:{title:'Kernel',tags:['Linux','GKI','ramdisk'],text:'El kernel Linux se descomprime, inicializa subsistemas, controladores esenciales y prepara el primer proceso de userspace. En dispositivos modernos puede usarse GKI.',bullets:['Recibe parámetros desde bootloader.','Monta estructuras mínimas necesarias.','Entrega control al init del ramdisk/userspace.'],link:'https://source.android.com/docs/core/architecture/kernel/boot-time-opt'},firstinit:{title:'First-stage init',tags:['ramdisk','mount','early userspace'],text:'Primera fase de Android init. Se ejecuta temprano, antes de tener todo el sistema montado, y prepara el entorno mínimo para continuar el arranque.',bullets:['Monta particiones necesarias.','Trabaja con fstab y ramdisk.','En system-as-root/dynamic partitions asume parte del montaje temprano.'],link:'https://source.android.com/docs/core/architecture/partitions/system-as-root'},secondinit:{title:'Second-stage init',tags:['init.rc','SELinux','services'],text:'Segunda fase de init. Carga configuración, procesa scripts rc, dispara acciones y arranca servicios organizados por clases.',bullets:['Lee imports y ficheros init*.rc.','Ejecuta triggers como early-init, init y boot.','Gestiona servicios, sockets, usuarios, grupos y reinicios.'],link:'https://android.googlesource.com/platform/system/core/+/master/init/README.md'},zygote:{title:'Zygote',tags:['ART','app_process','fork'],text:'Proceso lanzado por init que prepara Android Runtime. Es la base desde la que se crean System Server y procesos de aplicaciones.',bullets:['Se define en ficheros init.zygote*.rc.','Usa app_process/app_process64.','Prepara clases y recursos comunes.','Crea sockets para solicitudes de fork.'],link:'https://source.android.com/docs/core/runtime/zygote'},systemserver:{title:'System Server',tags:['framework','servicios del sistema','Android Java layer'],text:'Proceso de alto nivel que arranca servicios centrales del framework Android. Tras su inicialización, el sistema puede lanzar launcher y componentes de usuario.',bullets:['Arranca servicios como ActivityManager, PackageManager y WindowManager.','Coordina gran parte del framework.','Es un punto clave entre runtime y experiencia de usuario.'],link:'https://source.android.com/docs/core/runtime/zygote'}};

const timeline=[['0','Boot ROM','Ejecuta código inicial del SoC y comienza la cadena de arranque.'],['1','Bootloader','Inicializa memoria, verifica imágenes y selecciona modo/slot cuando aplica.'],['2','AVB','Verifica metadatos vbmeta y comunica estado de verified boot al kernel o bootconfig.'],['3','Kernel','Se carga, se descomprime, inicializa subsistemas y prepara userspace.'],['4','First-stage init','Realiza montajes tempranos y prepara transición al sistema Android.'],['5','Second-stage init','Lee init.rc, dispara acciones y arranca servicios nativos.'],['6','Zygote','Prepara ART y crea la base para System Server y apps.'],['7','System Server','Inicializa servicios del framework y habilita la experiencia Android.']];

const initCode=`# Ejemplo didáctico basado en la sintaxis oficial Android Init

import /system/etc/init/hw/init.${ro.zygote}.rc
import /system/etc/init/*.rc
import /vendor/etc/init/*.rc

on early-init
    start ueventd

on init
    sysclktz 0
    mkdir /dev/socket 0755 root root

on boot
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

const sources=[
['Boot process overview','https://source.android.com/docs/automotive/power/boot_time','Cadena general Boot ROM → Bootloader → Kernel → Init → Zygote → System Server.'],
['Bootloader overview','https://source.android.com/docs/core/architecture/bootloader','Funciones del bootloader y carga de boot images.'],
['Verified Boot boot flow','https://source.android.com/docs/security/features/verifiedboot/boot-flow','Estados green/yellow/orange y comunicación por cmdline/bootconfig.'],
['Partitions overview','https://source.android.com/docs/core/architecture/partitions','Particiones boot, init_boot, vendor_boot, vbmeta y sistema.'],
['Generic boot partition','https://source.android.com/docs/core/architecture/partitions/generic-boot','GKI, generic ramdisk y cambios Android 12/13+.'],
['Vendor boot partitions','https://source.android.com/docs/core/architecture/partitions/vendor-boot-partitions','Estructura de vendor_boot.'],
['Android Init Language','https://android.googlesource.com/platform/system/core/+/master/init/README.md','Actions, Commands, Services, Options e Imports.'],
['Zygote','https://source.android.com/docs/core/runtime/zygote','Descripción oficial de Zygote.']];

function renderStage(k){const s=stages[k];document.querySelectorAll('.step').forEach(b=>b.classList.toggle('active',b.dataset.step===k));document.getElementById('stagePanel').innerHTML=`<h3>${s.title}</h3><div class="tags">${s.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><p>${s.text}</p><ul>${s.bullets.map(b=>`<li>${b}</li>`).join('')}</ul><p><a href="${s.link}" target="_blank" rel="noopener">Documentación oficial ↗</a></p>`}
document.querySelectorAll('.step').forEach(b=>b.addEventListener('click',()=>renderStage(b.dataset.step)));
document.getElementById('timelineItems').innerHTML=timeline.map(t=>`<article class="panel timeitem"><div class="time">Fase ${t[0]}</div><div><h3>${t[1]}</h3><p>${t[2]}</p></div></article>`).join('');
document.getElementById('initCode').textContent=initCode;
document.getElementById('initNotes').innerHTML='<h3>Cómo leer este ejemplo</h3><p><code>import</code> carga otros scripts rc. <code>on</code> define acciones disparadas por triggers. <code>service</code> declara procesos que init controla durante el arranque.</p><p>El fichero real depende del árbol AOSP, versión Android, ABI y configuración del dispositivo.</p>';
document.getElementById('sourcesList').innerHTML=sources.map(s=>`<article class="panel"><h3>${s[0]}</h3><p>${s[2]}</p><a href="${s[1]}" target="_blank" rel="noopener">${s[1]} ↗</a></article>`).join('');
renderStage('rom');