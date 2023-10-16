<template>
    <div id="chat-container">
        <div class="chat-header">
            <h4 class="mt-3">Flashvolve Chat Bot</h4>
        </div>
        <div class="chat-body" ref="chatBody">
            <div class="messages" v-for="message in messages" :key="message._id">
                <div class="message-row user" v-if="message.username !== 'Bot'">
                    <div class="message user">
                        <p>
                            <i class="fa fa-user"></i> {{ message.message }}
                            <span class="time">{{ formatMessageDate(message.date) }}</span>
                        </p>
                    </div>
                </div>
                
                <div class="message-row bot" v-else>
                    <div class="message bot">
                        <p>
                            <i class="fa fa-robot"></i> {{ message.message }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-footer">
            <form @submit.prevent="sendMessage">
                <input v-model="messageContent" id="create-message" placeholder="Write a message..." />
                <input type="submit" />
            </form>
        </div>
        <div class="logout-button">
            <button @click="logout">Logout</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "ChatPage",
    inject: ['makeSpin'],
    data() {
        return {
            messages: [],
            messageContent: '',
            chatId: '',
        }
    },
    mounted() {
        if (!localStorage.getItem('token')) {
            this.$router.push({ name: 'login' });
            this.$swal({
                icon: 'error',
                title: 'Oops...',
                text: 'You must be logged in to access this page!',
                showConfirmButton: false,
                timer: 2000,
            });
        }
        
        this.makeSpin.value = true;
        
        this.getMessages();
        
        setTimeout(() => {
            this.makeSpin.value = false;
        }, 1500);
    },
    methods: {
        async getMessages() {
            try {
                const response = await axios.get(`users/${localStorage.getItem('username')}/messages`);
                
                this.messages = response.data.userMessages;
                
                this.chatId = this.messages[0].chatId;
                
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            } catch (error) {
                console.error("Error getting messages: ", error);
                this.$swal({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        },
        
        async sendMessage() {
            try {
                await axios.post(`${this.chatId}/send-message`, {
                    message: this.messageContent,
                    username: localStorage.getItem('username'),
                });
                
                this.messageContent = '';
                this.getMessages();
                document.getElementById('create-message').value = '';
            } catch (error) {
                console.error("Error sending message: ", error);
            }
        },
        
        scrollToBottom() {
            this.$refs.chatBody.scrollTop = this.$refs.chatBody.scrollHeight;
        },

        
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            
            this.$router.push({ name: 'login' });
            this.$swal({
                icon: 'success',
                title: 'Success!',
                text: 'You have been logged out!',
                showConfirmButton: false,
                timer: 2000,
            });
            
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        },

        formatMessageDate(date) {
            return date
                .split('T')[1]
                .split('.')[0]
                .split(':')
                .slice(0, 2)
                .join(':');
        },
    }
}
</script> 

<style>
#chat-container {
    background-image: url('../assets/bg-image.jpg');
    background-position: center;
    border-radius: 8px;
    height: 600px;
    width: 60%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    position: relative;
}

.chat-header {
    box-shadow: 0 4px 8px 0 rgba(255, 255, 255, 0.2);
    color: #fff;
}

.chat-footer {
    position: absolute;
    bottom: 0;
    margin-bottom: 1.5em;
    width: 100%;
}

.chat-footer form {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 95%;
    margin: 0 auto;
}

.chat-body {
    overflow-y: scroll;
    height: 83%;
}

#create-message {
    width: 80%;
    height: 2.5rem;
    border-radius: 8px;
}

#create-message:focus {
    outline: none;
}

input:not(#create-message) {
    background: linear-gradient(to right, #9fbbf7 0%, #6178fa 100%);
    border: 0;
    color: #222;
    padding: 0.6rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    opacity: 0.8;
}

input:not(#create-message):hover {
    opacity: 0.5;
}

.message-row {
    display: flex;
    justify-content: flex-end;
}

.message-row.bot {
    justify-content: flex-start;
}

.message p {
    color: #222;
    padding: 15px 15px 0px 15px;
}

.message {
    border-radius: 50px;
    text-align: center;
    margin: 2rem;
    
}
.message-row.user .message {
    background-color: #d0fd98;
}

.message-row.bot .message {
    background-color: #fff;
}

.chat-body::-webkit-scrollbar {
    width: 0px;
    height: 100%;
}

.message-row.user .time,
.message-row.bot .time {
    color: #999;
    font-size: 0.8rem;
    margin-left: 5px;
}

.logout-button {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 0.3em;
    margin-right: 1.5em;
}

.logout-button button {
    background: linear-gradient(to right, #e954ee 0%, #ff2222 100%);
    border: 0;
    color: #222;
    padding: 0.6rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    opacity: 0.8;
}
</style>