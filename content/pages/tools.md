Title: Tools
Slug: tools
Template: page

<style>
  .tools-wrapper {
    min-height: 60vh;
    display: grid;
    place-items: center;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .tools-card {
    padding: 32px 36px;
    border: 1px solid #e8ebf3;
    border-radius: 16px;
    background: linear-gradient(180deg, #ffffff 0%, #f7f9ff 100%);
    box-shadow: 0 16px 40px rgba(0,0,0,0.06);
    position: relative;
    z-index: 1;
  }

  .tools-title {
    font-size: clamp(20px, 3vw, 26px);
    margin-bottom: 10px;
    letter-spacing: -0.01em;
  }

  .tools-sub {
    font-size: clamp(13px, 1.6vw, 15px);
    color: #4b5566;
    margin-bottom: 4px;
  }

  /* Floating blobs animation */
  .blob {
    position: absolute;
    width: 160px;
    height: 160px;
    background: radial-gradient(circle at 30% 30%, rgba(75,107,251,0.25), rgba(124,146,255,0.12), transparent 70%);
    filter: blur(2px);
    border-radius: 50%;
    animation: float 14s ease-in-out infinite alternate;
    z-index: 0;
  }

  .blob:nth-child(1) { top: 12%; left: 14%; animation-delay: 0s; }
  .blob:nth-child(2) { bottom: 16%; right: 12%; animation-delay: 3s; }
  .blob:nth-child(3) { top: 35%; right: 32%; width: 200px; height: 200px; animation-delay: 6s; }

  @keyframes float {
    from { transform: translateY(0px) translateX(0px) scale(1); }
    to   { transform: translateY(18px) translateX(12px) scale(1.05); }
  }
</style>

<div class="tools-wrapper">
  <div class="blob"></div>
  <div class="blob"></div>
  <div class="blob"></div>
  <div class="tools-card">
    <h1 class="tools-title">Tools</h1>
    <p class="tools-sub">Coming soon</p>
  </div>
</div>
