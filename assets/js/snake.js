// 贪吃蛇游戏实现
(function() {
    const canvas = document.getElementById('snake-game');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const grid = 20;
    const count = 20;
    let snake = [{x: 9, y: 9}];
    let direction = {x: 1, y: 0};
    let food = {x: 5, y: 5};
    let gameOver = false;
    let moveQueue = [];
    let score = 0;

    function drawCell(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * grid, y * grid, grid - 2, grid - 2);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 画食物
        drawCell(food.x, food.y, '#fff600');
        // 画蛇
        snake.forEach((s, i) => drawCell(s.x, s.y, i === 0 ? '#00fff7' : '#fff'));
        // 画分数
        ctx.fillStyle = '#fff';
        ctx.font = '18px Orbitron, Arial, sans-serif';
        ctx.fillText('分数: ' + score, 10, 24);
    }

    function update() {
        if (gameOver) return;
        // 处理方向队列
        if (moveQueue.length) {
            direction = moveQueue.shift();
        }
        // 新蛇头
        const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
        // 撞墙或撞自己
        if (
            head.x < 0 || head.x >= count ||
            head.y < 0 || head.y >= count ||
            snake.some(s => s.x === head.x && s.y === head.y)
        ) {
            gameOver = true;
            setTimeout(() => {
                ctx.fillStyle = '#fff600';
                ctx.font = '32px Orbitron, Arial, sans-serif';
                ctx.fillText('游戏结束', 120, 210);
                ctx.font = '18px Orbitron, Arial, sans-serif';
                ctx.fillText('按空格重新开始', 120, 250);
            }, 100);
            return;
        }
        snake.unshift(head);
        // 吃到食物
        if (head.x === food.x && head.y === food.y) {
            score++;
            placeFood();
        } else {
            snake.pop();
        }
    }

    function placeFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * count),
                y: Math.floor(Math.random() * count)
            };
        } while (snake.some(s => s.x === newFood.x && s.y === newFood.y));
        food = newFood;
    }

    function loop() {
        update();
        draw();
        if (!gameOver) setTimeout(loop, 120);
    }

    document.addEventListener('keydown', function(e) {
        if (gameOver && e.code === 'Space') {
            // 重置游戏
            snake = [{x: 9, y: 9}];
            direction = {x: 1, y: 0};
            moveQueue = [];
            food = {x: 5, y: 5};
            gameOver = false;
            score = 0;
            loop();
        }
        const dirMap = {
            ArrowUp:    {x: 0, y: -1},
            ArrowDown:  {x: 0, y: 1},
            ArrowLeft:  {x: -1, y: 0},
            ArrowRight: {x: 1, y: 0}
        };
        if (dirMap[e.key] || dirMap[e.code]) {
            const newDir = dirMap[e.key] || dirMap[e.code];
            // 防止反向
            if (snake.length > 1 && newDir.x === -direction.x && newDir.y === -direction.y) return;
            if (moveQueue.length < 2) moveQueue.push(newDir);
        }
    });

    placeFood();
    loop();
})(); 