 const canvas = document.getElementById('burnCanvas');
    const ctx = canvas.getContext('2d');
    const button = document.getElementById('burnButton');
    const textarea = document.getElementById('letter');
    const fireSound = document.getElementById('fireSound');

    const spots = [];
    const maxSpots = 60;

    let burning = false;
    let burnFrame = 0;
    const maxFrames = 800;

    function addSpot() {
      const edge = Math.floor(Math.random() * 4);
      let x, y;
      const padding = 20;
      switch(edge) {
        case 0:
          x = Math.random() * canvas.width;
          y = Math.random() * padding;
          break;
        case 1:
          x = canvas.width - Math.random() * padding;
          y = Math.random() * canvas.height;
          break;
        case 2:
          x = Math.random() * canvas.width;
          y = canvas.height - Math.random() * padding;
          break;
        case 3:
          x = Math.random() * padding;
          y = Math.random() * canvas.height;
          break;
      }
      spots.push({
        x, y,
        radius: 2 + Math.random()*2,
        maxRadius: 40 + Math.random()*40,
        growthRate: 0.3 + Math.random()*0.3,
        flicker: Math.random() * 1000,
      });
    }

    function drawEmber(x, y, radius, flicker) {
      const glow = 30 + Math.sin(flicker * 0.02) * 10;
      const gradient = ctx.createRadialGradient(x, y, radius*0.4, x, y, radius + glow);
      gradient.addColorStop(0, 'rgba(255,140,0,0.8)');
      gradient.addColorStop(0.4, 'rgba(255,69,0,0.5)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius + glow, 0, 2 * Math.PI);
      ctx.fill();
    }

    function burnFrameUpdate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'destination-out';

      spots.forEach(spot => {
        spot.radius += spot.growthRate;
        if (spot.radius > spot.maxRadius) spot.radius = spot.maxRadius;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, spot.radius, 0, 2 * Math.PI);
        ctx.fill();
      });

      ctx.globalCompositeOperation = 'source-over';
      spots.forEach(spot => {
        drawEmber(spot.x, spot.y, spot.radius, spot.flicker);
        spot.flicker += 5;
      });

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(20, 10, 0, 0.05)';
      spots.forEach(spot => {
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, spot.radius + 10, 0, 2 * Math.PI);
        ctx.fill();
      });

      burnFrame++;
      if (burnFrame >= maxFrames) {
        burning = false;
        textarea.value = '';  // clear letter, remove if you want to keep text
        button.disabled = false;
        fireSound.pause();
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear burn canvas to make paper clear again
      } else {
        requestAnimationFrame(burnFrameUpdate);
      }
    }

    button.addEventListener('click', () => {
      if (burning) return;
      burning = true;
      burnFrame = 0;
      spots.length = 0;
      button.disabled = true;
      for(let i=0; i < maxSpots; i++) {
        addSpot();
      }
      fireSound.currentTime = 0;
      fireSound.play();
      burnFrameUpdate();
    });