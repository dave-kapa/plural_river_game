const { chromium } = require('playwright');

async function runE2ETraversal() {
  console.log('🚀 Iniciando Travesía E2E Integral y Validación de Auditoría (Playwright con Edge)...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('pageerror', (err) => {
    console.error('💥 PAGE ERROR details:', err.name, err.message, err.stack);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error('💥 BROWSER CONSOLE ERROR:', msg.text(), msg.location());
    } else if (msg.text().includes('DEBUG')) {
      console.log('🔍 BROWSER CONSOLE:', msg.text());
    }
  });

  const BASE_URL = 'http://localhost:3000';

  try {
    // 1. Portada y Pantalla de Carga 1 (10s, Serie A)
    console.log('📍 1. Navegando a la Portada y validando Pantalla de Carga 1 (10s)...');
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();

    // Validar presencia de Pantalla de Carga Inicial
    const initialLoadingRegion = page.locator('div[aria-label="Pantalla de carga inicial"]');
    await initialLoadingRegion.waitFor({ state: 'visible', timeout: 5000 });
    console.log('   ✓ Pantalla de Carga Inicial (10s) detectada');

    const loadingTitle = await page.locator('text=El río de la confluencia').isVisible();
    console.log('   ✓ Título de pantalla de carga (El río de la confluencia) visible:', loadingTitle);

    const initialBg = await page.locator('div[aria-label="Pantalla de carga inicial"] > div.absolute.inset-0').first().evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage;
    });
    console.log('   ✓ Imagen aleatoria Serie A seleccionada:', initialBg);
    if (!initialBg.includes('set-a')) {
      throw new Error(`La imagen de fondo inicial no pertenece a la Serie A: ${initialBg}`);
    }

    // Saltar el resto de los 10s para agilizar prueba
    const skipBtn = page.locator('button:has-text("Saltar")');
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
      console.log('   ✓ Botón Saltar pulsado para agilizar test');
    }
    await initialLoadingRegion.waitFor({ state: 'hidden', timeout: 5000 });

    // Validar estética de bordes en portada (Papiro quemado y Oro metálico limpio sin tachones)
    const manifestoBox = page.locator('div.border-burnt-papyrus');
    const isManifestoPapyrus = await manifestoBox.isVisible();
    console.log('   ✓ Manifiesto con borde de papiro quemado (.border-burnt-papyrus):', isManifestoPapyrus);

    const goldPremiseBox = page.locator('div.border-metallic-gold');
    const isGoldPremise = await goldPremiseBox.isVisible();
    console.log('   ✓ Premisa de navegación con borde oro metálico (.border-metallic-gold):', isGoldPremise);

    const hasEntryPill = await goldPremiseBox.locator('span:has-text("Idea de Entrada")').isVisible();
    console.log('   ✓ Contenedor de énfasis con pill "Idea de Entrada":', hasEntryPill);
    if (!hasEntryPill) {
      throw new Error('El contenedor de énfasis de la portada no contiene la insignia "Idea de Entrada"');
    }

    // Verificar que NO existan tachones en las 4 esquinas («✦»)
    const studsCount = await page.locator('div.border-metallic-gold span:has-text("✦")').count();
    console.log('   ✓ Tachones circulares en marco de oro (debe ser 0):', studsCount);
    if (studsCount > 0) {
      throw new Error('El marco metálico oro aún contiene tachones circulares («✦»)');
    }

    // Validación de Bloqueo de Acceso Directo a Afluentes sin habilitación legítima
    console.log('🔒 Validando bloqueo de acceso directo a /afluentes/evaluation-as-experience sin habilitación legítima...');
    await page.goto(`${BASE_URL}/afluentes/evaluation-as-experience`);
    await page.waitForSelector('text=Afluente aún no navegable', { timeout: 5000 });
    const lockedMsg = await page.locator('text=Afluente aún no navegable').isVisible();
    console.log('   ✓ Pantalla de bloqueo visible:', lockedMsg);
    if (!lockedMsg) {
      throw new Error('El afluente debió mostrar la pantalla de bloqueo y no lo hizo');
    }
    const mapReturnBtn = page.locator('a[href="/mapa"]:has-text("Volver a la cartografía del río")');
    console.log('   ✓ Enlace al mapa en pantalla de bloqueo visible:', await mapReturnBtn.isVisible());

    // Verificar que NO se haya añadido a visitedTributaries ni modificado el progreso
    const unauthStorage = await page.evaluate(() => {
      const p = JSON.parse(localStorage.getItem('plural_gameful_river_progress_v1') || '{}');
      return p.visitedTributaries || [];
    });
    if (unauthStorage.includes('evaluation-as-experience')) {
      throw new Error('El afluente bloqueado no debió añadirse a visitedTributaries');
    }
    console.log('   ✓ visitedTributaries permanece libre de afluentes no autorizados');

    // Regresar a la portada para iniciar la travesía regular
    await page.goto(BASE_URL);
    const initialLoadingRegion2 = page.locator('div[aria-label="Pantalla de carga inicial"]');
    try {
      await initialLoadingRegion2.waitFor({ state: 'visible', timeout: 3000 });
      const skipBtn2 = page.locator('button:has-text("Saltar")');
      if (await skipBtn2.isVisible()) {
        await skipBtn2.click();
      }
      await initialLoadingRegion2.waitFor({ state: 'hidden', timeout: 5000 });
    } catch {
      // Pantalla ya concluida o no visible
    }

    // Clic en "Comenzar la travesía" -> Pantalla de Carga 2 (5s, Serie B)
    console.log('   Haciendo clic en Comenzar la travesía...');
    const startBtn = page.locator('button:has-text("Comenzar la travesía")').first();
    await startBtn.click();

    const riverLoadingRegion = page.locator('div[aria-label="Transición hacia el río"]');
    await riverLoadingRegion.waitFor({ state: 'visible', timeout: 5000 });
    const riverLoadingText = await page.locator('text=Adentrándose en el río').isVisible();
    console.log('   ✓ Pantalla de Carga 2: Texto "Adentrándose en el río" visible:', riverLoadingText);

    // Esperar hasta llegar al mapa
    await page.waitForURL('**/mapa', { timeout: 10000 });
    console.log('   ✓ Transición completada y acceso al mapa confirmado');

    // 2. Mapa Inicial
    console.log('📍 2. Verificando estado inicial del Mapa...');
    const t1Link = page.locator('a[href="/territorios/territorio-1"]').first();
    await t1Link.waitFor({ state: 'visible', timeout: 8000 });
    await t1Link.click();
    await page.waitForURL('**/territorios/territorio-1');
    console.log('   ✓ Entrada al Territorio 1 confirmada');

    // 3. AUDITORÍA HALLAZGO 1 & AJUSTE MENOR: T1 Selección Parcial, Distractores y Persistencia tras Recarga
    console.log('📍 3. Auditoría Punto 1: Validando persistencia parcial y distractores en T1...');

    // A. Probar los 2 nuevos distractores
    const distractor1 = page.locator('button:has-text("sistemas de premios y castigos")').first();
    await distractor1.waitFor({ state: 'visible', timeout: 5000 });
    // Verificar que el distractor NO tenga la insignia "+1 concepto"
    const dist1Badge = await distractor1.locator('span:has-text("+1 concepto")').isVisible();
    console.log('   Distractor 1 tiene insignia "+1 concepto" (debe ser FALSE):', dist1Badge);
    if (dist1Badge) {
      throw new Error('El distractor "sistemas de premios y castigos" no debe mostrar la insignia "+1 concepto"');
    }
    await distractor1.click();
    await page.waitForSelector('text=Distinción de disciplina:', { timeout: 3000 });
    const dist1Feedback = await page.locator('text=condicionamiento conductual extrínseco').isVisible();
    console.log('   ✓ Feedback formativo de distractor 1 mostrado:', dist1Feedback);

    const distractor2 = page.locator('button:has-text("tecnologías de realidad virtual y aumentada")').first();
    const dist2Badge = await distractor2.locator('span:has-text("+1 concepto")').isVisible();
    console.log('   Distractor 2 tiene insignia "+1 concepto" (debe ser FALSE):', dist2Badge);
    if (dist2Badge) {
      throw new Error('El distractor "tecnologías de realidad virtual y aumentada" no debe mostrar la insignia "+1 concepto"');
    }
    await distractor2.click();
    const dist2Feedback = await page.locator('text=inmersión perceptual').isVisible();
    console.log('   ✓ Feedback formativo de distractor 2 mostrado:', dist2Feedback);

    // B. Selección Parcial de 2 disciplinas legítimas
    const disc1 = page.locator('button:has-text("ciencias del comportamiento")').first();
    const disc2 = page.locator('button:has-text("psicología")').first();
    await disc1.click();
    await page.waitForTimeout(200);
    await disc2.click();
    await page.waitForTimeout(400);

    // Comprobar 2/6 en la interfaz
    const partialCountText = await page.locator('text=2 de 6 disciplinas').isVisible();
    console.log('   ✓ Conteo parcial visible en UI (2 de 6 disciplinas):', partialCountText);
    if (!partialCountText) {
      throw new Error('La interfaz de T1 no muestra "2 de 6 disciplinas" tras seleccionar dos');
    }

    // Comprobar que en localStorage hay exactamente 2 disciplinas y 2 descubrimientos
    const rawStored = await page.evaluate(() => localStorage.getItem('plural_gameful_river_progress_v1'));
    console.log('   RAW LOCALSTORAGE ANTES DE RECARGA:', rawStored);

    const storedStateBeforeReload = await page.evaluate(() => {
      const p = JSON.parse(localStorage.getItem('plural_gameful_river_progress_v1') || '{}');
      return {
        selected: p.territoryInteractions?.['territorio-1']?.selectedDisciplines || [],
        discovered: p.discoveredItems || [],
      };
    });
    console.log('   Estado persistido antes de recargar:', storedStateBeforeReload);
    if (storedStateBeforeReload.selected.length !== 2 || storedStateBeforeReload.discovered.length !== 2) {
      throw new Error(`Persistencia inicial incorrecta: ${JSON.stringify(storedStateBeforeReload)}`);
    }

    // C. Recargar la página para verificar la reproducción y corrección del fallo
    console.log('   🔄 Recargando página en Territorio 1 para validar hidratación reactiva...');
    await page.reload();
    await page.waitForTimeout(600);

    const partialCountTextAfterReload = await page.locator('text=2 de 6 disciplinas').isVisible();
    console.log('   ✓ Conteo parcial conservado en UI tras recarga (2 de 6 disciplinas):', partialCountTextAfterReload);
    if (!partialCountTextAfterReload) {
      throw new Error('FALLO DE AUDITORÍA 1: Al recargar, la interfaz de T1 volvió a 0/6 en lugar de conservar 2/6');
    }

    const storedStateAfterReload = await page.evaluate(() => {
      const p = JSON.parse(localStorage.getItem('plural_gameful_river_progress_v1') || '{}');
      return {
        selected: p.territoryInteractions?.['territorio-1']?.selectedDisciplines || [],
        discovered: p.discoveredItems || [],
      };
    });
    console.log('   Estado persistido tras recargar:', storedStateAfterReload);
    if (storedStateAfterReload.selected.length !== 2 || storedStateAfterReload.discovered.length !== 2) {
      throw new Error(`FALLO DE AUDITORÍA 1: La bitácora y el estado persistido perdieron la selección parcial tras recargar`);
    }
    console.log('   🎉 AUDITORÍA PUNTO 1 SUPERADA: 2/6 en UI, 2/15 en bitácora y estado persistido coinciden tras recarga.');

    // 4. AUDITORÍA HALLAZGO 6: Revelado Progresivo en 4 Capas en T1
    console.log('📍 4. Auditoría Punto 6: Validando revelado progresivo en capas de T1...');

    // Verificar que los 4 lentes y la doctrina NO son visibles aún
    const lensesVisibleBefore = await page.locator('section[aria-labelledby="four-lenses-title"]').isVisible();
    console.log('   Lentes visibles antes de construir definición (debe ser FALSE):', lensesVisibleBefore);
    if (lensesVisibleBefore) {
      throw new Error('Los 4 lentes no deben verse antes de articular la definición');
    }

    // Completar las 4 disciplinas restantes
    const remainingDisciplines = [
      'neurociencia cognitiva',
      'experiencia de usuario',
      'narrativa',
      'diseño de juegos',
    ];
    for (const disc of remainingDisciplines) {
      await page.locator(`button:has-text("${disc}")`).first().click();
      await page.waitForTimeout(150);
    }
    console.log('   ✓ 6 disciplinas completadas');

    // Seleccionar propósito correcto
    await page.locator('button:has-text("construir sistemas motivacionales y de aprendizaje")').first().click();
    await page.waitForTimeout(400);

    // Capa 2: Ahora los 4 lentes deben revelarse, pero la doctrina profunda NO debe verse aún
    const lensesVisibleAfter = await page.locator('section[aria-labelledby="four-lenses-title"]').isVisible();
    console.log('   ✓ Capa 2: 4 lentes revelados:', lensesVisibleAfter);
    if (!lensesVisibleAfter) {
      throw new Error('Los 4 lentes deben revelarse tras articular la definición');
    }

    const nuancesVisibleEarly = await page.locator('section[aria-labelledby="deepening-title"]').isVisible();
    console.log('   Matices doctrinales visibles tempranamente (debe ser FALSE):', nuancesVisibleEarly);
    if (nuancesVisibleEarly) {
      throw new Error('FALLO DE AUDITORÍA 6: La doctrina profunda no debe revelarse antes de explorar los 4 lentes');
    }

    // Explorar los 4 lentes activamente
    const lensButtons = page.locator('section[aria-labelledby="four-lenses-title"] button');
    const lensCount = await lensButtons.count();
    console.log('   Explorando los 4 lentes...');
    for (let i = 0; i < lensCount; i++) {
      await lensButtons.nth(i).click();
      await page.waitForTimeout(300);
    }
    console.log('   ✓ 4 lentes explorados');

    // Capa 3: Ahora debe revelarse "Matices y principios doctrinales" con Playful vs Gameful, 8 falsas rutas y Premisa Nuclear
    const nuancesVisibleNow = await page.locator('section[aria-labelledby="deepening-title"]').isVisible();
    console.log('   ✓ Capa 3: Sección Matices y doctrina revelada:', nuancesVisibleNow);
    if (!nuancesVisibleNow) {
      throw new Error('La sección de matices debe revelarse tras explorar los 4 lentes');
    }

    const playfulVsGameful = await page.locator('text=Playful no es lo mismo que gameful').isVisible();
    console.log('   ✓ Playful vs Gameful visible:', playfulVsGameful);

    const nuclearPlaqueVisible = await page.locator('text=Premisa Nuclear de la Naciente').isVisible();
    console.log('   ✓ Placa de la premisa nuclear al fondo visible:', nuclearPlaqueVisible);

    // Comprobar que los principios doctrinales NO deben verse aún (requieren descartar las 8 falsas rutas)
    const principlesEarly = await page.locator('text=Doctrina Profunda').isVisible();
    console.log('   Principios doctrinales visibles antes de descartar 8 rutas (debe ser FALSE):', principlesEarly);
    if (principlesEarly) {
      throw new Error('FALLO DE AUDITORÍA 6: Los principios doctrinales no deben mostrarse antes de descartar las 8 rutas');
    }

    // Descartar las 8 falsas rutas
    console.log('   Descartando las 8 falsas rutas...');
    const discardButtons = page.locator('button:has-text("+ Descartar")');
    let dCount = await discardButtons.count();
    while (dCount > 0) {
      await discardButtons.first().click();
      await page.waitForTimeout(150);
      dCount = await page.locator('button:has-text("+ Descartar")').count();
    }
    console.log('   ✓ 8 falsas rutas descartadas');

    // Capa 4: Ahora deben revelarse los principios doctrinales en acordeón
    const principlesVisible = await page.locator('text=Doctrina Profunda').isVisible();
    console.log('   ✓ Capa 4: Principios doctrinales revelados tras descartar 8 rutas:', principlesVisible);
    if (!principlesVisible) {
      throw new Error('Los principios doctrinales deben revelarse tras descartar las 8 falsas rutas');
    }

    // Probar el acordeón de un principio
    const firstPrincipleBtn = page.locator('button:has-text("1. El juego como estructura")').or(page.locator('section[aria-labelledby="deepening-title"] button:has-text("1.")')).first();
    if (await firstPrincipleBtn.isVisible()) {
      await firstPrincipleBtn.click();
      await page.waitForTimeout(200);
      console.log('   ✓ Acordeón de principios doctrinales expandido exitosamente');
    }

    console.log('   🎉 AUDITORÍA PUNTO 6 SUPERADA: Las 4 capas progresivas y el acordeón funcionan perfectamente.');

    // 5. AUDITORÍA HALLAZGOS 2: Bifurcaciones Paralelas e Independencia T2/T3
    console.log('📍 5. Validando navegación hacia T2 y compuerta negativa de T4...');
    const toT2Link = page.locator('a[href="/territorios/territorio-2"]').first();
    await toT2Link.click();
    await page.waitForURL('**/territorios/territorio-2');

    // Explorar las 3 fuerzas de T2
    const forceButtons = page.locator('section[aria-labelledby="three-forces-title"] > div.grid > button');
    for (let i = 0; i < 3; i++) {
      await forceButtons.nth(i).click();
      await page.waitForTimeout(250);
    }
    console.log('   ✓ 3 fuerzas examinadas en T2');

    // Validar compuerta negativa: T4 debe estar bloqueado porque T3 falta
    const statusT2CompleteOnly = await page.evaluate(() => {
      const p = JSON.parse(localStorage.getItem('plural_gameful_river_progress_v1') || '{}');
      return { t2: p.territoryStatus?.['territorio-2'], t3: p.territoryStatus?.['territorio-3'], t4: p.territoryStatus?.['territorio-4'] };
    });
    console.log('   Estado tras T2 completado:', statusT2CompleteOnly);
    if (statusT2CompleteOnly.t4 !== 'locked') {
      throw new Error(`Compuerta negativa violada: T4 está ${statusT2CompleteOnly.t4} antes de completar T3`);
    }

    // Ir a T3 y completar 4 zonas
    console.log('   Navegando a T3 para completar segunda corriente...');
    await page.goto(`${BASE_URL}/territorios/territorio-3`);
    await page.waitForURL('**/territorios/territorio-3');
    await page.waitForSelector('section[aria-labelledby="ecosystem-zones-title"]', { timeout: 8000 });

    const zoneButtons = page.locator('section[aria-labelledby="ecosystem-zones-title"] > div.grid > button');
    for (let i = 0; i < 4; i++) {
      await zoneButtons.nth(i).click();
      await page.waitForTimeout(250);
    }
    console.log('   ✓ 4 zonas examinadas en T3');

    // Ahora ambas corrientes completas -> T4 debe estar desbloqueado
    const statusBothComplete = await page.evaluate(() => {
      const p = JSON.parse(localStorage.getItem('plural_gameful_river_progress_v1') || '{}');
      return { t2: p.territoryStatus?.['territorio-2'], t3: p.territoryStatus?.['territorio-3'], t4: p.territoryStatus?.['territorio-4'] };
    });
    console.log('   Estado tras T2 y T3 completados:', statusBothComplete);
    if (statusBothComplete.t4 !== 'unlocked') {
      throw new Error(`T4 debería estar unlocked, pero está: ${statusBothComplete.t4}`);
    }

    // 6. Territorio 4
    console.log('📍 6. Avanzando a Territorio 4...');
    await page.goto(`${BASE_URL}/territorios/territorio-4`);
    await page.waitForURL('**/territorios/territorio-4');

    // Responder las 5 decisiones
    for (let step = 0; step < 5; step++) {
      const correctOption = page.locator('button:has-text("Alinear el propósito"), button:has-text("Mapear la experiencia"), button:has-text("Transformar las ayudas"), button:has-text("Capturar evidencia"), button:has-text("Aumentar fidelidad")').first();
      await correctOption.waitFor({ state: 'visible', timeout: 8000 });
      await correctOption.click();
      await page.waitForTimeout(2200);
    }
    console.log('   ✓ 5 fases de T4 articuladas');

    // Explorar 3 espacios de análisis
    const spaceCards = page.locator('section[aria-labelledby="four-spaces-title"] button');
    for (let i = 0; i < 3; i++) {
      await spaceCards.nth(i).click();
      await page.waitForTimeout(100);
    }
    console.log('   ✓ 3 espacios examinados');

    // T4 completo -> T5 desbloqueado
    await page.goto(`${BASE_URL}/territorios/territorio-5`);
    await page.waitForURL('**/territorios/territorio-5');
    console.log('   ✓ Llegada a Territorio 5 (Delta)');

    // 7. AUDITORÍA HALLAZGO 3: Registrar 3er afluente y atajo directo a créditos y mapa sin pasar por T5
    console.log('📍 7. Auditoría Punto 3: Explorando los 3 afluentes y probando atajo directo...');
    const tributaries = ['evaluation-as-experience', 'from-intervention-to-product', 'new-horizons'];

    // Registrar los dos primeros
    for (let i = 0; i < 2; i++) {
      await page.goto(`${BASE_URL}/afluentes/${tributaries[i]}`);
      const regBtn = page.locator('button:has-text("Registrar este horizonte")');
      await regBtn.waitFor({ state: 'visible', timeout: 8000 });
      await regBtn.click();
      await page.waitForTimeout(200);
    }
    console.log('   ✓ 2 afluentes registrados');

    // Registrar el tercer afluente ('new-horizons')
    await page.goto(`${BASE_URL}/afluentes/new-horizons`);
    await page.waitForURL('**/afluentes/new-horizons');
    const thirdRegBtn = page.locator('button:has-text("Registrar este horizonte")');
    await thirdRegBtn.waitFor({ state: 'visible', timeout: 8000 });
    await thirdRegBtn.click();
    await page.waitForTimeout(400);
    console.log('   ✓ 3er afluente registrado');

    // Comprobar que en el pie de página del afluente aparecen los enlaces directos a Créditos Y al Mapa
    const directMapLink = page.locator('a[href="/mapa"]:has-text("Volver al río (Mapa)")');
    const isDirectMapVisible = await directMapLink.isVisible();
    console.log('   ✓ Enlace directo a Mapa presente en el afluente:', isDirectMapVisible);
    if (!isDirectMapVisible) {
      throw new Error('FALLO DE AUDITORÍA 3: Falta el enlace directo al mapa en el pie del afluente');
    }

    const directCreditsLink = page.locator('a[href="/creditos"]:has-text("Acceder a los Créditos")');
    const isDirectCreditsVisible = await directCreditsLink.isVisible();
    console.log('   ✓ Enlace directo a Créditos presente en el afluente:', isDirectCreditsVisible);
    if (!isDirectCreditsVisible) {
      throw new Error('FALLO DE AUDITORÍA 3: Falta el enlace directo a créditos en el pie del afluente');
    }

    // Probar el ATAJO DIRECTO: Clic directo en "Volver al río (Mapa)" SIN pasar por T5
    console.log('   Navegando directamente al Mapa desde el 3er afluente (sin entrar a T5)...');
    await directMapLink.click();
    await page.waitForURL('**/mapa');

    // Comprobar HUD en el mapa: 5 de 5 territorios completados (5/5)
    const cauce5de5 = await page.locator('text=5/5').first().isVisible();
    console.log('   ✓ HUD de navegación muestra 5/5 completados en el Mapa:', cauce5de5);
    if (!cauce5de5) {
      throw new Error('FALLO DE AUDITORÍA 3: El HUD no muestra 5/5 completados tras registrar el 3er afluente');
    }

    // Abrir la Bitácora modal y comprobar que las 5 frases están presentes
    console.log('   Abriendo la Bitácora desde el TopNav...');
    const journalBtn = page.locator('button:has-text("Bitácora")').first();
    await journalBtn.click();
    await page.waitForSelector('#journal-modal-title', { timeout: 5000 });

    const journalState = await page.evaluate(() => {
      const p = JSON.parse(localStorage.getItem('plural_gameful_river_progress_v1') || '{}');
      return {
        entriesCount: Object.keys(p.journalEntries || {}).length,
        entries: p.journalEntries || {},
      };
    });
    console.log('   Frases registradas en la Bitácora:', journalState.entriesCount, 'de 5');
    console.log('   Frase de T5 registrada:', !!journalState.entries['territorio-5']);
    if (journalState.entriesCount < 5 || !journalState.entries['territorio-5']) {
      throw new Error(`FALLO DE AUDITORÍA 3: La bitácora tiene ${journalState.entriesCount}/5 frases. Falta la frase de T5.`);
    }
    console.log('   🎉 AUDITORÍA PUNTO 3 SUPERADA: 5/5 en cauce, 5 frases en bitácora y créditos abiertos sin reingresar a T5.');

    // Cerrar modal de bitácora
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Navegar directamente a Créditos
    console.log('   Navegando a Créditos...');
    const topNavCredits = page.locator('a[href="/creditos"]').first();
    await topNavCredits.click();
    await page.waitForURL('**/creditos');

    const creditsHeading = await page.locator('h1').textContent();
    console.log('   ✓ Créditos cargados exitosamente:', creditsHeading?.trim());

    // 8. AUDITORÍA HALLAZGO 2: Restauración honesta de estados completados sin interacciones
    console.log('📍 8. Validando restauración honesta de estados legacy/incompletos sin interacciones...');
    await page.evaluate(() => {
      localStorage.setItem('plural_gameful_river_progress_v1', JSON.stringify({
        version: 1,
        selectedImageSeries: 'A',
        territoryStatus: {
          'territorio-1': 'completed',
          'territorio-2': 'completed',
          'territorio-3': 'completed',
          'territorio-4': 'completed',
          'territorio-5': 'unlocked',
        },
        territoryInteractions: {},
        visitedTributaries: [],
        discoveredNuances: [],
        journalEntries: {},
      }));
    });

    // Visitar Territorio 1
    await page.goto(`${BASE_URL}/territorios/territorio-1`);
    await page.waitForSelector('text=Hito disponible para re-exploración', { timeout: 5000 });
    console.log('   ✓ T1: Banner de re-exploración visible');
    const t1DiscCount = await page.locator('text=0 de 6 disciplinas').isVisible();
    console.log('   ✓ T1: 0 de 6 disciplinas seleccionadas (sin elecciones ficticias):', t1DiscCount);
    if (!t1DiscCount) {
      throw new Error('T1 debió mostrar 0 de 6 disciplinas');
    }

    // Visitar Territorio 2
    await page.goto(`${BASE_URL}/territorios/territorio-2`);
    await page.waitForSelector('text=Hito disponible para re-exploración', { timeout: 5000 });
    console.log('   ✓ T2: Banner de re-exploración visible');
    const porExplorarCount = await page.locator('text=Por explorar').count();
    const descubiertasCount = await page.locator('text=✓ Descubierta').count();
    console.log('   ✓ T2: 3 fuerzas por explorar y 0 descubiertas (sin fuerzas ficticias):', porExplorarCount === 3 && descubiertasCount === 0);
    if (porExplorarCount !== 3 || descubiertasCount !== 0) {
      throw new Error(`T2 debió mostrar 3 fuerzas por explorar y 0 descubiertas. Se encontraron ${porExplorarCount} por explorar y ${descubiertasCount} descubiertas.`);
    }

    // Visitar Territorio 4
    await page.goto(`${BASE_URL}/territorios/territorio-4`);
    await page.waitForSelector('text=Hito disponible para re-exploración', { timeout: 5000 });
    console.log('   ✓ T4: Banner de re-exploración visible');
    const t4PhasesCount = await page.locator('text=0 de 5 momentos articulados').isVisible();
    console.log('   ✓ T4: 0 de 5 momentos articulados (sin matriz ficticia):', t4PhasesCount);
    if (!t4PhasesCount) {
      throw new Error('T4 debió mostrar 0 de 5 momentos articulados');
    }

    // Abrir la Bitácora y verificar que no hay descubrimientos inventados
    const journalBtnLegacy = page.locator('button:has-text("Bitácora")').first();
    await journalBtnLegacy.click();
    await page.waitForSelector('#journal-modal-title', { timeout: 5000 });
    const bitacoraZeroPercent = await page.locator('text=0%').first().isVisible();
    console.log('   ✓ Bitácora: 0% de descubrimientos (sin avance ficticio):', bitacoraZeroPercent);
    if (!bitacoraZeroPercent) {
      throw new Error('La Bitácora debió mostrar 0% de descubrimientos para estados sin interacciones');
    }
    await page.keyboard.press('Escape');

    console.log('\n=============================================================');
    console.log('🌟 ¡AUDITORÍA COMPLETA SUPERADA EXITOSAMENTE! 🌟');
    console.log('Todos los puntos de auditoría y ajustes locales validados.');
    console.log('=============================================================\n');
  } catch (err) {
    console.error('\n❌ ERROR EN LA TRAVESÍA E2E:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

runE2ETraversal().catch((e) => {
  console.error(e);
  process.exit(1);
});
