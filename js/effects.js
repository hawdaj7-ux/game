/* ============================================
   HAWDAJ GAME — Visual Effects & Particles
   ============================================ */

const HawdajEffects = (() => {
    let canvas, ctxC;
    let particles = [];
    let animFrame;
    let running = false;

    function init() {
        canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        ctxC = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
        start();

        // Start constant background particles
        setInterval(() => {
            if (Math.random() > 0.5) {
                ambientParticles(1);
            }
        }, 1000);
    }

    function resize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function start() {
        if (running) return;
        running = true;
        loop();
    }

    function loop() {
        if (!running) return;
        ctxC.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life -= p.decay;

            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity || 0;
            p.rotation += p.rotSpeed || 0;

            const alpha = Math.min(1, p.life);
            ctxC.save();
            ctxC.translate(p.x, p.y);
            ctxC.rotate(p.rotation || 0);
            ctxC.globalAlpha = alpha;

            if (p.type === 'circle') {
                ctxC.beginPath();
                ctxC.arc(0, 0, p.size, 0, Math.PI * 2);
                ctxC.fillStyle = p.color;
                ctxC.fill();
            } else if (p.type === 'star') {
                drawStar(ctxC, 0, 0, 5, p.size, p.size / 2, p.color);
            } else if (p.type === 'confetti') {
                ctxC.fillStyle = p.color;
                ctxC.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else if (p.type === 'text') {
                ctxC.font = `${p.size}px Tajawal`;
                ctxC.fillStyle = p.color;
                ctxC.textAlign = 'center';
                ctxC.fillText(p.text, 0, 0);
            }

            ctxC.restore();
        }

        animFrame = requestAnimationFrame(loop);
    }

    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
            rot += step;
            ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
            rot += step;
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    // Effect Functions
    function sparkle(x, y, count = 12) {
        const colors = ['#FFD700', '#FFA500', '#FFEC8B', '#FFE4B5', '#FFF8DC'];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = 2 + Math.random() * 3;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                decay: 0.02 + Math.random() * 0.02,
                type: 'star',
                gravity: 0.05,
                rotation: 0,
                rotSpeed: (Math.random() - 0.5) * 0.2
            });
        }
    }

    function confetti(x, y, count = 30) {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98FB98'];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: x + (Math.random() - 0.5) * 100,
                y: y - Math.random() * 50,
                vx: (Math.random() - 0.5) * 8,
                vy: -3 - Math.random() * 5,
                size: 6 + Math.random() * 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                decay: 0.008 + Math.random() * 0.008,
                type: 'confetti',
                gravity: 0.15,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.3
            });
        }
    }

    function fireworks(x, y) {
        const colors = ['#FFD700', '#FF4444', '#44FF44', '#4444FF', '#FF44FF', '#FFAA00'];
        const mainColor = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 40; i++) {
            const angle = (Math.PI * 2 / 40) * i + Math.random() * 0.3;
            const speed = 3 + Math.random() * 5;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 3,
                color: mainColor,
                life: 1,
                decay: 0.015 + Math.random() * 0.01,
                type: 'circle',
                gravity: 0.08,
                rotation: 0,
                rotSpeed: 0
            });
        }
    }

    function scoreFloat(x, y, text, color = '#FFD700') {
        particles.push({
            x, y,
            vx: 0,
            vy: -2,
            size: 28,
            color,
            life: 1,
            decay: 0.015,
            type: 'text',
            text,
            gravity: -0.02,
            rotation: 0,
            rotSpeed: 0
        });
    }

    function floatingStars(count = 20) {
        // Obsolete function, mapped to ambient particles for legacy calls
        ambientParticles(count);
    }

    function ambientParticles(count = 1) {
        if (!canvas) return;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + 10,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -0.5 - Math.random() * 1.5,
                size: 1 + Math.random() * 3,
                color: `rgba(255,215,0,${0.2 + Math.random() * 0.4})`,
                life: 1,
                decay: 0.001 + Math.random() * 0.002,
                type: 'star',
                gravity: 0,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.05
            });
        }
    }

    function celebrationBurst() {
        if (!canvas) return;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Multiple firework bursts
        fireworks(cx, cy);
        setTimeout(() => fireworks(cx - 100, cy - 50), 200);
        setTimeout(() => fireworks(cx + 100, cy - 50), 400);
        setTimeout(() => confetti(cx, cy - 100, 50), 300);
    }

    function goldenFlash() {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100vw';
        flash.style.height = '100vh';
        flash.style.backgroundColor = 'rgba(255, 215, 0, 0.5)';
        flash.style.mixBlendMode = 'overlay';
        flash.style.zIndex = '9999';
        flash.style.pointerEvents = 'none';
        flash.style.transition = 'opacity 0.5s ease-out';
        flash.style.opacity = '1';
        document.body.appendChild(flash);

        // trigger reflow
        flash.getBoundingClientRect();

        requestAnimationFrame(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 500);
        });
    }

    // Screen shake
    function shake(element, intensity = 5, duration = 400) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;
        el.style.transition = 'none';
        const startTime = Date.now();

        function doShake() {
            const elapsed = Date.now() - startTime;
            if (elapsed >= duration) {
                el.style.transform = '';
                el.style.transition = '';
                return;
            }
            const progress = elapsed / duration;
            const currentIntensity = intensity * (1 - progress);
            const x = (Math.random() - 0.5) * currentIntensity * 2;
            const y = (Math.random() - 0.5) * currentIntensity * 2;
            el.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(doShake);
        }
        doShake();
    }

    function cleanup() {
        particles = [];
    }

    return {
        init, sparkle, confetti, fireworks, scoreFloat,
        floatingStars, ambientParticles, celebrationBurst, goldenFlash, shake, cleanup
    };
})();
