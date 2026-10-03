<template>
  <div>
    <svg width="0" height="0" style="position: absolute" aria-hidden="true" focusable="false">
      <defs>
        <filter id="rgb" x="-20%" y="-20%" width="140%" height="140%">
          <feOffset in="SourceGraphic" dx="3" dy="0" result="r" />
          <feOffset in="SourceGraphic" dx="-3" dy="0" result="b" />
          <feMerge>
            <feMergeNode in="r" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
    <HalftoneField />
    <div class="site">
      <a class="skip tap" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <slot />
      </main>
      <SiteFooter />
      <Terminal />
      <DemoDialog />
    </div>
  </div>
</template>
