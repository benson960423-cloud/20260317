let inputElement;
let sliderElement;
let buttonElement;
let dropdownElement;
let iframeDiv;
let iframeElement;
let isJumping = false;
// 定義顏色陣列
const colors = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];

function setup() {
  // 建立一個佔滿整個視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 建立一個文字輸入框並設定其位置
  inputElement = createInput('Hello'); // 預設給一點文字方便預覽
  inputElement.position(20, 20);
  // 設定 input 元件的樣式與大小
  inputElement.style('font-size', '20px');
  inputElement.size(200, 25);

  // 1. 建立滑桿：範圍 15-80，預設 30
  // 位置：在 input 右邊 20px (input x=20, width=200 -> slider x=240)
  sliderElement = createSlider(15, 80, 30);
  sliderElement.position(240, 25);
  
  // 2. 建立按鈕：跳動開關
  // 位置：在 slider 右邊 20px (slider 寬度約 130px，視瀏覽器而定，這裡抓個概略位置)
  // 為了精準，我們可以用變數計算，但 p5 createSlider 預設寬度約 130
  buttonElement = createButton('跳動');
  buttonElement.position(sliderElement.x + sliderElement.width + 20, 25);
  buttonElement.mousePressed(toggleJump);

  // 3. 建立下拉式選單
  // 位置：在按鈕右邊 20px
  dropdownElement = createSelect();
  dropdownElement.position(buttonElement.x + buttonElement.width + 20, 25);
  // 加入選項
  dropdownElement.option('淡江教科系', 'https://www.et.tku.edu.tw');
  dropdownElement.option('淡江大學', 'https://www.tku.edu.tw');
  // 設定選單改變時的事件
  dropdownElement.changed(updateIframe);

  // 4. 建立 DIV 與 Iframe
  // 位於視窗中間，四周內距 200px
  iframeDiv = createDiv('');
  iframeDiv.style('position', 'absolute');
  iframeDiv.style('top', '200px');
  iframeDiv.style('left', '200px');
  iframeDiv.style('right', '200px');
  iframeDiv.style('bottom', '200px');
  iframeDiv.style('opacity', '0.95'); // 透明度 95%
  iframeDiv.style('background', 'white'); // 設個背景色以免完全透視到後方雜亂文字
  
  // 在 Div 內建立 Iframe
  iframeElement = createElement('iframe');
  iframeElement.parent(iframeDiv);
  iframeElement.style('width', '100%');
  iframeElement.style('height', '100%');
  iframeElement.style('border', 'none');
  iframeElement.attribute('src', 'https://www.et.tku.edu.tw');

  // 設定文字大小與對齊方式
  textAlign(LEFT, CENTER); // 水平靠左，垂直置中
}

function draw() {
  background(220);
  const inputText = inputElement.value();
  // 從滑桿取得文字大小
  const txtSize = sliderElement.value();
  textSize(txtSize);
  
  // 只有當輸入框有內容時才進行繪製
  if (inputText.length > 0) {
    const textW = textWidth(inputText);
    // 設定排與排之間的間距：文字高度 + 50px
    const spacingY = 50 + txtSize; 
    
    // 用來計算顏色索引的計數器
    let count = 0;

    // 從 y=100 開始，產生整個視窗的文字
    for (let y = 100; y < height; y += spacingY) {
      let x = 0;
      while (x < width) {
        // 依照順序循環使用顏色陣列
        fill(colors[count % colors.length]);
        
        let xOffset = 0;
        let yOffset = 0;
        
        // 如果跳動模式開啟
        if (isJumping) {
          // 根據位置與時間產生不同的跳動距離
          // 使用 noise 或 sin 讓每個位置的跳動幅度有些微差異
          let jumpRange = map(sin(frameCount * 0.1 + x * 0.01 + y * 0.01), -1, 1, 2, 10);
          xOffset = random(-jumpRange, jumpRange);
          yOffset = random(-jumpRange, jumpRange);
        }

        text(inputText, x + xOffset, y + yOffset);
        
        x += textW + 30; // 水平間距維持 30px
        count++; // 下一個文字
      }
    }
  }

  // 在右上方顯示學號和姓名
  push();
  fill(0); // 設定文字顏色為黑色
  textSize(20);
  textAlign(RIGHT, TOP); // 設定對齊方式為靠右、靠上
  text('414730894 呂承諺', width - 40, 20); // 繪製文字，增加右邊間距
  pop();
}

function toggleJump() {
  isJumping = !isJumping;
}

function updateIframe() {
  // 取得選單的值 (網址) 並更新 iframe
  const url = dropdownElement.value();
  iframeElement.attribute('src', url);
}
