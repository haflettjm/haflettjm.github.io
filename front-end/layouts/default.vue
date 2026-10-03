<template>
  <div class="site">
    <a class="skip tap" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main" class="site-main">
      <slot />
    </main>
    <SiteFooter />
    <Terminal />
  </div>
</template>
