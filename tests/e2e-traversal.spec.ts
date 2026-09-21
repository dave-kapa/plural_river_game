import { test, expect } from '@playwright/test';

test.describe('E2E Travesía Completa - Plural Gameful River (Gameful Layer v2)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure fresh traversal
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
  });

  test('Recorrido completo: Portada -> T1 -> T2 -> T3 -> T4 (con reload) -> T5 (afluentes) -> Créditos', async ({ page }) => {
    // 1. Portada
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1')).toContainText('El cambio es un ecosistema');

    // Clic en Iniciar Travesía
    const enterBtn = page.getByRole('link', { name: /iniciar travesía/i }).or(page.getByRole('link', { name: /entrar/i })).first();
    await enterBtn.click();
    await page.waitForURL('**/mapa');

    // 2. Mapa Inicial
    await expect(page.getByRole('heading', { name: /mapa del cauce fluvial/i })).toBeVisible();

    // Territorio 1 está desbloqueado
    const t1Node = page.locator('a[href="/territorios/territorio-1"]').first();
    await expect(t1Node).toBeVisible();
    await t1Node.click();
    await page.waitForURL('**/territorios/territorio-1');

    // 3. Territorio 1
    await expect(page.locator('h1')).toContainText('Entrar al cauce');

    // Disciplinas: seleccionar las 6 correctas
    const discButtons = [
      'Ciencias del comportamiento',
      'Psicología',
      'Neurociencia cognitiva',
      'Experiencia de usuario',
      'Narrativa',
      'Diseño de juegos',
    ];

    for (const name of discButtons) {
      const btn = page.getByRole('button', { name: new RegExp(name, 'i') }).first();
      await btn.click();
    }

    // Seleccionar propósito correcto
    const correctPurpose = page.getByRole('button', { name: /construir sistemas motivacionales y de aprendizaje/i }).first();
    await correctPurpose.click();

    // Articular definición canónica
    const buildBtn = page.getByRole('button', { name: /articular definición canónica/i });
    await expect(buildBtn).toBeEnabled();
    await buildBtn.click();

    // Explorar 3 lentes esenciales
    const lenses = page.locator('button:has-text("Lente:")');
    const lensCount = await lenses.count();
    for (let i = 0; i < Math.min(3, lensCount); i++) {
      await lenses.nth(i).click();
    }

    // El territorio 1 ahora debe estar completado
    await expect(page.getByText('✓ Recorrido')).toBeVisible();

    // Continuar hacia el mapa o territorio 2
    const nextBtn = page.getByRole('link', { name: /explorar las dos corrientes/i }).or(page.getByRole('link', { name: /continuar al territorio 2/i })).first();
    await nextBtn.click();

    // 4. Territorio 2
    if (!page.url().includes('territorio-2')) {
      await page.goto('http://localhost:3000/territorios/territorio-2');
    }
    await page.waitForURL('**/territorios/territorio-2');
    await expect(page.locator('h1')).toContainText('Las aguas que nutren la capacidad');

    // Explorar las 3 fuerzas
    const forceCards = page.locator('button:has-text("Examinar fuerza")');
    const fCount = await forceCards.count();
    for (let i = 0; i < fCount; i++) {
      await forceCards.nth(i).click();
      await page.waitForTimeout(100);
    }

    // Verificar que T2 está completado
    await expect(page.locator('article')).toContainText('Fuerzas y Capacidades Registradas');

    // Verificar que el footer dice que T3 falta y ofrece ir a T3 (Inconsistencia 6 solucionada)
    await expect(page.getByRole('link', { name: /explorar qué permite diseñar \(territorio 3\)/i })).toBeVisible();

    // Ir a Territorio 3
    await page.getByRole('link', { name: /explorar qué permite diseñar \(territorio 3\)/i }).click();
    await page.waitForURL('**/territorios/territorio-3');

    // 5. Territorio 3
    await expect(page.locator('h1')).toContainText('Diseñar un ecosistema vivo');

    // Explorar al menos 4 zonas
    const zoneButtons = page.locator('section[aria-labelledby="ecosystem-zones-title"] button');
    for (let i = 0; i < 4; i++) {
      await zoneButtons.nth(i).click();
      await page.waitForTimeout(100);
    }

    // T3 debe estar completado
    await expect(page.locator('article')).toContainText('Ecosistema Vivo Registrado');

    // Ahora ambas corrientes están completas: debe ofrecer enlace a T4
    const advanceToT4 = page.getByRole('link', { name: /avanzar hacia la confluencia \(territorio 4\)/i });
    await expect(advanceToT4).toBeVisible();
    await advanceToT4.click();
    await page.waitForURL('**/territorios/territorio-4');

    // 6. Territorio 4
    await expect(page.locator('h1')).toContainText('La confluencia');

    // Verificar que inicialmente no se puede avanzar a T5
    await expect(page.getByText(/confluencia en construcción/i)).toBeVisible();

    // Resolver las 5 decisiones de fases metodológicas
    for (let step = 0; step < 5; step++) {
      // Buscar la opción correcta que contenga palabras clave
      const correctOption = page.locator('button:has-text("Definir la experiencia buscada"), button:has-text("Mapear la experiencia real"), button:has-text("Transformar las ayudas"), button:has-text("Capturar evidencia"), button:has-text("Aumentar fidelidad")').first();
      await expect(correctOption).toBeVisible();
      await correctOption.click();
      await page.waitForTimeout(300);
    }

    // Validar Persistencia (Inconsistencia 4): Recargar la página
    await page.reload();
    await expect(page.getByText('5 de 5 momentos articulados')).toBeVisible();

    // Explorar 3 espacios de análisis
    const spaceButtons = page.locator('section[aria-labelledby="four-spaces-title"] button');
    for (let i = 0; i < 3; i++) {
      await spaceButtons.nth(i).click();
      await page.waitForTimeout(100);
    }

    // T4 ahora debe estar completado y desbloquear T5
    await expect(page.getByRole('link', { name: /avanzar al territorio 5/i })).toBeVisible();
    await page.getByRole('link', { name: /avanzar al territorio 5/i }).click();
    await page.waitForURL('**/territorios/territorio-5');

    // 7. Territorio 5 & Afluentes
    await expect(page.locator('h1')).toContainText('El delta y nuevos horizontes');

    const tributaryKeys = [
      'evaluation-as-experience',
      'from-intervention-to-product',
      'new-horizons',
    ];

    for (const key of tributaryKeys) {
      await page.goto(`http://localhost:3000/afluentes/${key}`);
      await expect(page.locator('h1')).toBeVisible();

      // Clic en registrar horizonte
      const registerHorizonBtn = page.getByRole('button', { name: /registrar este horizonte en la bitácora/i });
      if (await registerHorizonBtn.isVisible()) {
        await registerHorizonBtn.click();
        await expect(page.getByText('✓ Horizonte registrado')).toBeVisible();
      }
    }

    // Volver a T5
    await page.goto('http://localhost:3000/territorios/territorio-5');
    await expect(page.getByText('3 de 3 afluentes explorados')).toBeVisible();
    await expect(page.getByText('Desembocadura alcanzada')).toBeVisible();

    // Botón de Créditos desbloqueado
    const creditsBtn = page.getByRole('link', { name: /acceder a los créditos de la travesía/i });
    await expect(creditsBtn).toBeVisible();
    await creditsBtn.click();
    await page.waitForURL('**/creditos');

    // 8. Créditos
    await expect(page.locator('h1')).toContainText('Créditos & Epílogo');
  });
});
