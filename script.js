/* ============================================
   script.js - デジタルおみくじ 最終版
   固定ヘッダー + 16枚札 + リセットボタン
   ============================================ */

(function() {
    'use strict';

    // ---------- 抽選データ ----------
    const BINARY_LIST = [
        "〇一", "〇二", "〇三", "〇四",
        "〇五", "〇六", "〇七", "〇八",
        "〇九", "一〇", "一一", "一二",
        "一三", "一四", "一五", "一六"
    ];
    const WAIT_TIME = 2500;     // 2.5秒
    const CARD_COUNT = 16;      // 16枚

    // DOM要素
    const cardsGrid = document.getElementById('cardsGrid');
    const binaryNumber = document.getElementById('binary-number');
    const binarySuffix = document.getElementById('binary-suffix');
    const waitingMsg = document.getElementById('waiting-message');
    const resetButton = document.getElementById('resetButton');

    let isDrawing = false;
    let timeoutId = null;

    // ---------- 札を16枚生成 ----------
    function buildCards() {
        cardsGrid.innerHTML = '';
        for (let i = 0; i < CARD_COUNT; i++) {
            const card = document.createElement('div');
            card.className = 'omikuji-card';
            card.textContent = 'おみくじ';
            card.setAttribute('data-index', i);
            card.addEventListener('click', onCardClick);
            cardsGrid.appendChild(card);
        }
    }

    // ---------- 札クリック ----------
    function onCardClick(e) {
        if (isDrawing) return;
        startDrawing();
    }

    // ---------- 抽選開始 ----------
    function startDrawing() {
        isDrawing = true;

        const allCards = document.querySelectorAll('.omikuji-card');
        allCards.forEach(card => card.classList.add('disabled'));

        binaryNumber.textContent = '';
        binarySuffix.textContent = '';
        waitingMsg.textContent = '抽選中・・・';

        const randomIndex = Math.floor(Math.random() * BINARY_LIST.length);
        const selectedBinary = BINARY_LIST[randomIndex];

        timeoutId = setTimeout(() => {
            binaryNumber.textContent = selectedBinary;
            binarySuffix.textContent = '番';
            waitingMsg.textContent = '';

            allCards.forEach(card => card.classList.remove('disabled'));
            isDrawing = false;
            timeoutId = null;
        }, WAIT_TIME);
    }

    // ---------- リセット処理 ----------
    function resetDisplay() {
        // タイマー解除
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        // 表示を初期化
        binaryNumber.textContent = '----';
        binarySuffix.textContent = '';
        waitingMsg.textContent = '';
        // フラグ解除
        isDrawing = false;
        // 全札を有効化
        const allCards = document.querySelectorAll('.omikuji-card');
        allCards.forEach(card => card.classList.remove('disabled'));
    }

    // ---------- 初期表示 ----------
    function initializeDisplay() {
        binaryNumber.textContent = '----';
        binarySuffix.textContent = '';
        waitingMsg.textContent = '';
    }

    // ---------- ハンバーガーメニュー制御 ----------
    function setupMobileMenu() {
        const toggleBtn = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        if (!toggleBtn || !navMenu) return;

        toggleBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            this.classList.toggle('active');
            const expanded = navMenu.classList.contains('show');
            this.setAttribute('aria-expanded', expanded);
        });

        // メニュー外クリックで閉じる
        document.addEventListener('click', function(e) {
            if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('show');
                toggleBtn.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // メニュー内リンクをタップしたら閉じる
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                toggleBtn.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---------- スムーススクロール（遊び方リンク用） ----------
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#howto') {
                    e.preventDefault();
                    const target = document.querySelector('#howto');
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    // ---------- 初期化 ----------
    function init() {
        buildCards();
        initializeDisplay();
        setupMobileMenu();
        setupSmoothScroll();

        if (resetButton) {
            resetButton.addEventListener('click', resetDisplay);
        }

        window.addEventListener('beforeunload', function() {
            if (timeoutId) clearTimeout(timeoutId);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
