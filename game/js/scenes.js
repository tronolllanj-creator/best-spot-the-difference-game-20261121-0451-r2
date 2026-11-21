const PW = 600;
const PH = 640;
const circ = (ctx, x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
const rect = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
const poly = (ctx, pts, c) => { ctx.fillStyle = c; ctx.beginPath(); pts.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])); ctx.fill(); };
const line = (ctx, x1, y1, x2, y2, c, w) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
const SCENES = [
  {
    id: 'harbor',
    name: 'Harbor Sunset',
    subtitle: 'Quiet coastal evening with boats and gulls',
    diffs: [
      {x:55,y:285,r:26,label:'lighthouse lamp'},
      {x:150,y:430,r:30,label:'third boat'},
      {x:300,y:110,r:24,label:'gulls'},
      {x:430,y:330,r:22,label:'boat flag'},
      {x:90,y:505,r:24,label:'buoy'},
      {x:62,y:300,r:22,label:'house window'},
      {x:480,y:485,r:24,label:'jumping fish'}
    ],
    draw(ctx, variant) {
      rect(ctx, 0, 0, 600, 240, '#2b1a38');
      rect(ctx, 0, 240, 600, 80, '#d15b3b');
      rect(ctx, 0, 320, 600, 60, '#f2a643');
      circ(ctx, 300, 200, 50, '#ffeb99');
      rect(ctx, 0, 380, 600, 260, '#10394a');
      line(ctx, 50, 420, 150, 420, '#1a5266', 3);
      line(ctx, 350, 460, 480, 460, '#1a5266', 3);
      rect(ctx, 0, 560, 600, 80, '#b88642');
      poly(ctx, [[35,380],[55,270],[75,380]], '#dcdcdc');
      poly(ctx, [[40,320],[70,320],[70,335],[40,335]], '#a83232');
      if (variant === 0) {
        circ(ctx, 55, 285, 22, '#ffff66');
      }
      rect(ctx, 50, 310, 45, 50, '#664422');
      poly(ctx, [[45,310],[72,285],[95,310]], '#442211');
      if (variant === 0) {
        rect(ctx, 60, 315, 15, 18, '#ffff66');
      } else {
        rect(ctx, 60, 315, 15, 18, '#221100');
      }
      poly(ctx, [[120,440],[180,440],[170,410],[130,410]], '#dddddd');
      line(ctx, 150, 410, 150, 385, '#553311', 2);
      poly(ctx, [[150,385],[170,395],[150,400]], '#cc3333');
      if (variant === 0) {
        poly(ctx, [[130,445],[170,445],[165,420],[135,420]], '#555555');
      }
      poly(ctx, [[380,480],[460,480],[450,440],[390,440]], '#eeeeee');
      line(ctx, 420, 440, 420, 405, '#442211', 2);
      if (variant === 0) {
        poly(ctx, [[420,405],[445,415],[420,422]], '#cc2222');
      } else {
        poly(ctx, [[420,405],[445,415],[420,422]], '#2233cc');
      }
      if (variant === 0) {
        circ(ctx, 90, 505, 10, '#ff5500');
        rect(ctx, 87, 490, 6, 15, '#dddddd');
      }
      line(ctx, 280, 120, 290, 110, '#ffffff', 2);
      line(ctx, 290, 110, 300, 120, '#ffffff', 2);
      line(ctx, 310, 115, 320, 105, '#ffffff', 2);
      line(ctx, 320, 105, 330, 115, '#ffffff', 2);
      if (variant === 0) {
        line(ctx, 340, 125, 350, 115, '#ffffff', 2);
        line(ctx, 350, 115, 360, 125, '#ffffff', 2);
      }
      line(ctx, 260, 130, 270, 122, '#ffffff', 2);
      line(ctx, 270, 122, 280, 130, '#ffffff', 2);
      if (variant === 0) {
        poly(ctx, [[475,495],[495,475],[485,505]], '#ffcc44');
        circ(ctx, 470, 510, 3, '#ffffff');
      }
    }
  },
  {
    id: 'garden',
    name: 'Midnight Garden',
    subtitle: 'Moonlit flora and nocturnal fauna',
    diffs: [
      { x: 480, y: 300, r: 26, label: 'cat on fence' },
      { x: 200, y: 180, r: 24, label: 'fireflies' },
      { x: 120, y: 450, r: 24, label: 'big flower' },
      { x: 520, y: 485, r: 24, label: 'red mushroom' },
      { x: 300, y: 380, r: 26, label: 'fountain' },
      { x: 90, y: 120, r: 24, label: 'owl' },
      { x: 540, y: 220, r: 22, label: 'lantern' }
    ],
    draw(ctx, variant) {
      rect(ctx, 0, 0, 600, 600, '#0a0a1e');
      circ(ctx, 450, 100, 40, '#ffffe0');
      rect(ctx, 50, 150, 60, 200, '#121226');
      rect(ctx, 480, 120, 70, 230, '#121226');
      rect(ctx, 0, 300, 600, 15, '#2c1e12');
      rect(ctx, 0, 315, 600, 285, '#192b19');
      if (variant === 0) {
        circ(ctx, 480, 300, 14, '#202020');
      }
      rect(ctx, 270, 350, 60, 60, '#3a3a4a');
      if (variant === 0) {
        line(ctx, 290, 360, 310, 360, '#66ccff', 2);
        line(ctx, 285, 370, 315, 370, '#66ccff', 2);
      } else {
        line(ctx, 280, 360, 320, 360, '#444455', 2);
      }
      circ(ctx, 120, 450, 20, variant === 0 ? '#ff66b2' : '#3366ff');
      circ(ctx, 200, 180, 3, '#ffff88');
      circ(ctx, 215, 170, 3, '#ffff88');
      circ(ctx, 185, 190, 3, '#ffff88');
      circ(ctx, 195, 200, 3, '#ffff88');
      if (variant === 0) {
        circ(ctx, 210, 190, 3, '#ffff88');
        circ(ctx, 190, 175, 3, '#ffff88');
      }
      if (variant === 0) {
        circ(ctx, 520, 485, 12, '#cc2222');
      }
      if (variant === 0) {
        circ(ctx, 90, 120, 12, '#3a3a4a');
      }
      rect(ctx, 535, 210, 10, 20, variant === 0 ? '#ffaa00' : '#333333');
    }
  },
  {
    id: 'bakery',
    name: 'Morning Bakery',
    subtitle: 'Fresh bread and pastries.',
    diffs: [
      { x: 300, y: 95, r: 26, label: 'awning stripes' },
      { x: 150, y: 420, r: 26, label: 'bread loaves' },
      { x: 500, y: 505, r: 28, label: 'bicycle' },
      { x: 420, y: 260, r: 24, label: 'cat in window' },
      { x: 300, y: 205, r: 24, label: 'sign' },
      { x: 80, y: 525, r: 22, label: 'flower pot' },
      { x: 520, y: 120, r: 24, label: 'chimney smoke' }
    ],
    draw(ctx, variant) {
      rect(ctx, 0, 0, 600, 600, '#ffeebb');
      rect(ctx, 480, 80, 80, 100, '#b86b43');
      if (variant === 0) {
        circ(ctx, 520, 120, 16, '#dddddd');
        circ(ctx, 510, 95, 12, '#cccccc');
        circ(ctx, 530, 75, 10, '#bbbbbb');
      }
      rect(ctx, 50, 150, 500, 450, '#f2d2a9');
      rect(ctx, 220, 380, 160, 220, '#5c3a21');
      rect(ctx, 240, 400, 120, 180, '#8b5a2b');
      rect(ctx, 245, 180, 110, 140, '#ffffff');
      rect(ctx, 270, 180, 60, 140, '#87ceeb');
      rect(ctx, 250, 420, 100, 140, '#a0522d');
      if (variant === 0) {
        ctx.fillStyle = '#ff0000';
      } else {
        ctx.fillStyle = '#008080';
      }
      rect(ctx, 180, 80, 240, 30, ctx.fillStyle);
      rect(ctx, 210, 110, 180, 20, '#ffffff');
      if (variant === 0) {
        circ(ctx, 420, 260, 16, '#ff8c00');
        circ(ctx, 412, 252, 6, '#00ff00');
        circ(ctx, 428, 252, 6, '#00ff00');
      }
      rect(ctx, 100, 400, 100, 160, '#d2b48c');
      rect(ctx, 110, 440, 80, 100, '#8b4513');
      if (variant === 0) {
        circ(ctx, 130, 420, 10, '#d27d2d');
        circ(ctx, 150, 420, 10, '#d27d2d');
        circ(ctx, 170, 420, 10, '#d27d2d');
        circ(ctx, 140, 405, 10, '#d27d2d');
        circ(ctx, 160, 405, 10, '#d27d2d');
      } else {
        circ(ctx, 135, 420, 10, '#d27d2d');
        circ(ctx, 155, 420, 10, '#d27d2d');
        circ(ctx, 145, 405, 10, '#d27d2d');
        circ(ctx, 165, 405, 10, '#d27d2d');
      }
      rect(ctx, 260, 195, 80, 30, '#ffffff');
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (variant === 0) {
        ctx.fillStyle = '#008000';
        ctx.fillText('OPEN', 300, 210);
      } else {
        ctx.fillStyle = '#ff0000';
        ctx.fillText('CLOSED', 300, 210);
      }
      if (variant === 0) {
        circ(ctx, 470, 505, 18, '#333333');
        circ(ctx, 530, 505, 18, '#333333');
        rect(ctx, 485, 490, 30, 5, '#555555');
        rect(ctx, 500, 475, 15, 30, '#555555');
      }
      if (variant === 0) {
        circ(ctx, 80, 525, 14, '#ff69b4');
        rect(ctx, 70, 539, 20, 16, '#8b4513');
      }
    }
  }
];

function sceneById(id) {
  for (let i = 0; i < SCENES.length; i++) {
    if (SCENES[i].id === id) {
      return SCENES[i];
    }
  }
  return SCENES[0];
}
