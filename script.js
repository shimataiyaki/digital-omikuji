/* ============================================
   script.js - 二進数おみくじ 機能 & UI制御
   ============================================ */

(function() {
    'use strict';

    // ---------- おみくじ抽選ロジック ----------
    const BINARY_LIST = [
        "0000", "0001", "0010", "0011",
        "0100", "0101", "0110", "0111",
        "1000", "1001", "1010", "1011",
        "1100", "1101", "1110", "1111"
    ];
    const WAIT_TIME = 2500;
    const CARD_COUNT = 10;

    // DOM要素（おみくじ関連）
    const cardsGrid = document.getElementById('cardsGrid');
    const binaryNumber = document.getElementById('binary-number');
    const binarySuffix = document.getElementById('binary-suffix');
    const waitingMsg = document.getElementById('waiting-message');

    let isDrawing = false;
    let timeoutId = null;

    // 札を生成
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

    function onCardClick(e) {
        if (isDrawing) return;
        startDrawing();
    }

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
            binarySuffix.textContent = '(2)';
            waitingMsg.textContent = '';

            allCards.forEach(card => card.classList.remove('disabled'));
            isDrawing = false;
            timeoutId = null;
        }, WAIT_TIME);
    }

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
            navMenu.classList.toggle('active');
            const expanded = navMenu.classList.contains('active');
            this.setAttribute('aria-expanded', expanded);
        });

        // メニュー外クリックで閉じる
        document.addEventListener('click', function(e) {
            if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // 画面幅が広がったらメニューを強制リセット
        window.addEventListener('resize', function() {
            if (window.innerWidth > 600) {
                navMenu.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // メニュー内リンクをタップしたら閉じる（モバイルで自然な動作）
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---------- スムーススクロール（遊び方リンク用） ----------
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#howto') {
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
