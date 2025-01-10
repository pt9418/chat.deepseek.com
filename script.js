document.addEventListener('DOMContentLoaded', function() {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const clearBtn = document.getElementById('clear-btn');

    // 添加欢迎消息
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message bot-message';
    welcomeMessage.innerHTML = `
        <div class="message-content">
            欢迎来到全新宇宙。。。
        </div>
    `;
    chatWindow.appendChild(welcomeMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    let userId = generateUserId();

    // 清除聊天记录
    function clearChat() {
        chatWindow.innerHTML = '';
    }

    // 生成唯一用户ID
    function generateUserId() {
        return 'user-' + Math.random().toString(36).substr(2, 9);
    }

    // 添加消息到聊天窗口
    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // 直接调用DeepSeek API
    async function sendMessage(message) {
        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-47d335249bcd498288744bdbd3cda4c7'
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [{ role: "user", content: message }],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            const data = await response.json();
            addMessage(data.choices[0].message.content, false);
        } catch (error) {
            console.error('Error:', error);
            addMessage('抱歉，暂时无法连接到AI助手。', false);
        }
    }

    // 发送按钮点击事件
    sendBtn.addEventListener('click', function() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            sendMessage(message);
            userInput.value = '';
        }
    });

    // 清除按钮点击事件
    clearBtn.addEventListener('click', function() {
        clearChat();
    });

    // 回车键发送消息
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
});
