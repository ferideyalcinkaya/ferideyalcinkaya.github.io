

// toplam coin miktarı
let totalCoins = 0;

// Sayfa yüklendiğinde giriş müziğini çalmayı dener
window.addEventListener("load", () => {
  const introMusic = document.getElementById("introMusic");
  introMusic.play().catch(() => {
    console.log("Giriş müziği otomatik çalamadı.");
  });
});

// Canvas alanını oluştur ve tam ekran boyutunu ayarla
const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// Arka planda hareket edecek çiçeklerin sayısını ve özelliklerini belirle
const flowerCount = 40;
let flowers = [];
for (let i = 0; i < flowerCount; i++) {
  flowers.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 24 + 12,
    speed: Math.random() * 0.5 + 0.2,
    sway: Math.random() * 2,
    angle: Math.random() * Math.PI * 2
  });
}

// Belirli bir çiçeği ekrana çizer (🌸)
function drawFlower(flower) {
  ctx.font = `${flower.size}px serif`;
  ctx.fillText("🌸", flower.x, flower.y);
}

// Çiçekleri animasyonla yukarı doğru hareket ettir
function animateFlowers() {
  // Oyun başladıysa arka plan çiçeklerini durdur
  if (document.body.classList.contains("playing")) return;

   // Tüm alanı temizle
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Her çiçeği sırayla güncelle ve çiz
  flowers.forEach(f => {
    drawFlower(f);
    f.y -= f.speed;
    f.angle += 0.01;
    f.x += Math.sin(f.angle) * f.sway;
    if (f.y + f.size < 0) {
      f.y = canvas.height + 20;
      f.x = Math.random() * canvas.width;
    }
  });
  
  // Sonsuz animasyon döngüsü
  requestAnimationFrame(animateFlowers);
}
animateFlowers();


// Ekran boyutu değişirse canvas'ı yeniden boyutlandır
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const playButton = document.getElementById('playButton');
const howToButton = document.querySelector('.how-to-play');
const closeHowTo = document.getElementById('closeHowTo');
const popup = document.getElementById('howToPlayPopup');
const mainMenu = document.getElementById('mainMenu');
const gameScreen = document.getElementById('gameScreen');

function getFlowerEmoji(type, size) {
  return size <= 0 ? "🥀" : type;
}

// seviyeleri ve hakları gösterir
const levels = [
  {
    targetBouquet: [
      { type: "🌹", size: 3 },
      { type: "🌻", size: 2 },
      { type: "🌼", size: 3 },
      { type: "🌷", size: 1 }
    ],
    availableRights: ["💧", "➖", "💧", "👻"]
  },
  {
    targetBouquet: [
      { type: "🌼", size: 2 },
      { type: "🌹", size: 3 },
      { type: "🌻", size: 1 },
      { type: "🌷", size: 2 }
    ],
    availableRights: ["➖", "💧", "👻", "➖"]
  },
  {
    targetBouquet: [
      { type: "🌼", size: 3 },
      { type: "🌻", size: 1 },
      { type: "🌷", size: 2 },
      { type: "🌹", size: 3 }
    ],
    availableRights: ["💧", "👻", "➖", "💧"]
  },
  {
    targetBouquet: [
      { type: "🌷", size: 3 },
      { type: "🌼", size: 1 },
      { type: "🌻", size: 3 },
      { type: "🌹", size: 1 }
    ],
    availableRights: ["💧", "👻","➖", "👻", "💧"],
    requiredMoves: ["ArrowRight", "ArrowLeft", "ArrowLeft","ArrowLeft", "ArrowLeft"]
  }
];

// Oyunun durumunu tutacak değişkenler tanımlanır
let currentLevelIndex = 0;
let currentLevel = null;
let playerBouquet = [];
let usedRights = [];
let selectedFlowerIndex = 0;
let selectedRightIndex = 0;
let playerMoves = [];

// Derin kopyalama yapan fonksiyon
function deepCloneBouquet(b) {
  return b.map(f => ({ ...f }));
}


// coin sayacını günceller
function updateCoinUI() {
  const coinEl = document.getElementById('coinCounter');
  if (coinEl) {
    coinEl.textContent = `💰 ${totalCoins}`;
  }
}


// Hedef buketi ekranda göster
function renderTargetBouquet() {
  const targetBubble = document.getElementById('targetBubble');
  targetBubble.innerHTML = currentLevel.targetBouquet.map(f => {
    const scaleY = 1 + (f.size - 2) * 0.6;
    return `<span class="flower" style="transform: scaleY(${scaleY});">${getFlowerEmoji(f.type, f.size)}</span>`;
  }).join('');
}

// Oyuncunun çiçek buketini ekrana çiz
function renderPlayerFlowers() {
  const container = document.getElementById('playerFlowers');
  container.innerHTML = playerBouquet.map((f, i) => {
    const scaleY = 1 + (f.size - 2) * 0.6;
    const sel = i === selectedFlowerIndex ? 'selectedFlower' : '';
    const scale = i === selectedFlowerIndex ? 1.1 : 1;
    return `<span class="flower ${sel}" style="transform: scale(${scale}) scaleY(${scaleY});">${getFlowerEmoji(f.type, f.size)}</span>`;
  }).join('');
}

// Oyuncuya verilen hakları çizer
function renderRights() {
  const container = document.getElementById('rightsContainer');
  container.innerHTML = currentLevel.availableRights.map((r, i) => {
    const used = usedRights[i] ? 'usedRight' : '';
    const sel = i === selectedRightIndex ? 'selectedRight' : '';
    return `<span class="right ${sel} ${used}">${r}</span>`;
  }).join('');
}

function updateFlowerSelection() {
  document.querySelectorAll('#playerFlowers .flower').forEach((el, i) =>
    el.classList.toggle('selectedFlower', i === selectedFlowerIndex)
  );
}

function updateRightSelection() {
  const waterSound = document.getElementById('waterSound');
  const deathSound = document.getElementById('deathSound');

  document.querySelectorAll('#rightsContainer .right').forEach((el, i) => {
    const isSelected = i === selectedRightIndex;
    el.classList.toggle('selectedRight', isSelected);

    if (isSelected) {
      const isWater = el.textContent.trim() === '💧';
      const isDeath = el.textContent.trim() === '👻';
      const isUsed = el.classList.contains('usedRight');

      if (isWater && !isUsed) {
        waterSound.currentTime = 0;
        waterSound.play().catch(() => {});
      } else {
        waterSound.pause();
        waterSound.currentTime = 0;
      }

      if (isDeath && !isUsed) {
        deathSound.currentTime = 0;
        deathSound.play().catch(() => {});
      } else {
        deathSound.pause();
        deathSound.currentTime = 0;
      }
    }
  });
}

function applyRightToFlower() {
  if (usedRights[selectedRightIndex]) return;
  const f = playerBouquet[selectedFlowerIndex];
  const r = currentLevel.availableRights[selectedRightIndex];
  if (r === '💧' && f.size > 0 && f.size < 3) f.size++;
  else if (r === '👻') {
    if (f.size > 1) f.size--;
    else if (f.size === 1) f.size = 0;
  }
  usedRights[selectedRightIndex] = true;
  renderPlayerFlowers();
  renderRights();
  updateRightSelection();
}

function loadLevel() {
  currentLevel = levels[currentLevelIndex];
  usedRights = new Array(currentLevel.availableRights.length).fill(false);
  selectedFlowerIndex = 0;
  selectedRightIndex = 0;
  playerMoves = [];
  document.getElementById('levelIndicator').textContent = `Level ${currentLevelIndex + 1}`;

  if (currentLevelIndex === 3) {
    playerBouquet = [
      { type: "🌷", size: 2 },
      { type: "🌼", size: 2 },
      { type: "🌻", size: 2 },
      { type: "🌹", size: 2 }
    ];
  } else {
    playerBouquet = deepCloneBouquet(currentLevel.targetBouquet).map(f => ({ ...f, size: 2 }));
  }

  renderTargetBouquet();
  renderPlayerFlowers();
  renderRights();
  updateRightSelection();
}

function checkWinCondition() {
  const match = currentLevel.targetBouquet.every((t, i) =>
    playerBouquet[i].type === t.type && playerBouquet[i].size === t.size
  );

  if (currentLevel.requiredMoves) {
    const expected = currentLevel.requiredMoves.join(',');
    const actual = playerMoves.join(',');
    if (!match || actual !== expected) return;
  } else {
    if (!match) return;
    totalCoins += 20;
    updateCoinUI();

  }

  const transition = document.getElementById("levelTransition");
  transition.classList.remove("hidden");

  const goodJobSound = document.getElementById("goodJobSound");
  goodJobSound.currentTime = 0;
  goodJobSound.play().catch(() => {});

  setTimeout(() => {
    goodJobSound.pause();
    goodJobSound.currentTime = 0;
  }, 1200);

  setTimeout(() => {
    transition.classList.add("hidden");
    currentLevelIndex++;
    playerMoves = [];
    if (currentLevelIndex < levels.length) {
      loadLevel();
    } else {
   
    document.querySelector('#gameInfo h2').innerHTML = `Tüm seviyeler tamamlandı! `;
    // Mağaza ekranını göster
    document.getElementById("shopOverlay").classList.remove("hidden");
    document.getElementById("shopCoins").textContent = totalCoins;
    document.getElementById("gameScreen").classList.add("hidden");



      ["waterSound", "deathSound", "goodJobSound"].forEach(id => {
        const audio = document.getElementById(id);
        audio.pause();
        audio.currentTime = 0;
      });
    }
  }, 1200);
}

window.addEventListener('keydown', e => {
  if (!document.body.classList.contains('playing')) return;
  const fLen = playerBouquet.length;
  const rLen = currentLevel.availableRights.length;

  if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && selectedRightIndex < rLen) {
    playerMoves.push(e.key);
    applyRightToFlower();
    checkWinCondition();
    selectedRightIndex++;
  }

  if (e.key === 'ArrowLeft') {
    selectedFlowerIndex = (selectedFlowerIndex - 1 + fLen) % fLen;
  } else if (e.key === 'ArrowRight') {
    selectedFlowerIndex = (selectedFlowerIndex + 1) % fLen;
  }

  updateFlowerSelection();
  updateRightSelection();
});

playButton.addEventListener('click', () => {
  const introMusic = document.getElementById("introMusic");
  const waterSound = document.getElementById("waterSound");
  const deathSound = document.getElementById("deathSound");

  [waterSound, deathSound].forEach(audio => {
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
    }).catch(() => {});
  });

  introMusic.pause();
  introMusic.currentTime = 0;
  document.body.classList.add('playing');
  mainMenu.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  // 💰 coin sayacını gösterir
  document.getElementById("coinCounter").classList.remove("hidden");

  document.querySelector('#gameInfo h2').textContent = '';
  currentLevelIndex = 0;
  loadLevel();
});


howToButton.addEventListener('click', () => popup.classList.remove('hidden'));
closeHowTo.addEventListener('click', () => popup.classList.add('hidden'));

window.addEventListener("keydown", (e) => {
  if ((e.key === "r" || e.key === "R") && document.body.classList.contains("playing")) {
    document.querySelector('#gameInfo h2').textContent = '';
    loadLevel();
  }
});


// Mağaza "Satın Al" butonuna tıklanınca çalışacak
document.getElementById("shopConfirmButton").addEventListener("click", () => {
  const options = document.querySelectorAll(".shopOption");
  let selectedItems = [];
  let totalCost = 0;

  // Seçilen seçenekleri kontrol et
  options.forEach(option => {
    if (option.checked) {
      const cost = parseInt(option.getAttribute("data-cost"));
      if (totalCost + cost <= totalCoins) {
        selectedItems.push(option.getAttribute("data-name"));
        totalCost += cost;
      } else {
        option.checked = false; // coin yetmiyorsa işaret kaldır
      }
    }
  });

  // Sonucu göster
  const resultText = selectedItems.length > 0
    ? `Tebrikler! ${selectedItems.join(" ve ")} seçtiniz! 🎉`
    : `Hiçbir şey seçilmedi! `;

  const resultEl = document.getElementById("shopResult");
  resultEl.textContent = resultText;
  resultEl.classList.remove("hidden"); // görünür yap


  // Coin'den düş (görsel olarak da istersen gösterilebilir)
  totalCoins -= totalCost;
  document.getElementById("shopCoins").textContent = totalCoins;

  // Tüm oyun burada biter (istersen "yeniden başla" butonu eklenebilir)
});
