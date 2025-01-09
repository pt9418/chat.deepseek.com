// 获取DOM元素
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const userIcon = document.querySelector('.user-icon');
const usernameDisplay = document.querySelector('.username');
const modal = document.getElementById('register-modal');
const closeBtn = document.querySelector('.close');
const registerForm = document.getElementById('register-form');

// 用户数据
let currentUser = null;

// API基础URL
const API_BASE_URL = 'http://localhost:3001';

// 注册功能
async function registerUser(username, password) {
    // 简单验证
    if (!username || !password) {
        alert('用户名和密码不能为空');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            currentUser = username;
            usernameDisplay.textContent = username;
            closeModal();
            alert('注册成功');
        } else {
            alert(data.error || '注册失败');
        }
    } catch (error) {
        console.error('注册失败:', error);
        alert('注册失败，请稍后再试');
    }
}

// 检查登录状态
async function checkLogin() {
    try {
        const response = await fetch(`${API_BASE_URL}/check-login`);
        const data = await response.json();
        
        if (response.ok && data.username) {
            currentUser = data.username;
            usernameDisplay.textContent = data.username;
        }
    } catch (error) {
        console.error('检查登录状态失败:', error);
    }
}

// 模态框控制
function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    registerForm.reset();
}

// 事件监听
userIcon.addEventListener('click', () => {
    if (!currentUser) {
        openModal();
    }
});

closeBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    registerUser(username, password);
});

// 初始化检查登录状态
checkLogin();

// 聊天功能
function clearChat() {
    chatWindow.innerHTML = '';
}

function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'bot-message loading';
    loading.innerHTML = '思考中<span class="dot1">.</span><span class="dot2">.</span><span class="dot3">.</span>';
    chatWindow.appendChild(loading);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return loading;
}

function removeLoading(loading) {
    loading.remove();
}

function addMessage(message, isUser = true) {
    const messageElement = document.createElement('div');
    messageElement.className = isUser ? 'user-message' : 'bot-message';
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function getAIResponse(message) {
    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer sk-47d335249bcd498288744bdbd3cda4c7`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{role: "user", content: message}],
                temperature: 0.7,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('API请求错误:', error);
        return '抱歉，我暂时无法处理您的请求。请稍后再试。';
    }
}

sendBtn.addEventListener('click', async () => {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message);
        chatInput.value = '';
        
        const loading = showLoading();
        try {
            const aiResponse = await getAIResponse(message);
            removeLoading(loading);
            addMessage(aiResponse, false);
        } catch (error) {
            removeLoading(loading);
            addMessage('对话出现错误，请稍后再试。', false);
        }
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

clearBtn.addEventListener('click', () => {
    clearChat();
});
