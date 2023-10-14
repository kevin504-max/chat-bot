<template>
    <div class="spin" v-if="start">
        <div class="ring">
            <div class="lds-circle">
                <div></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SpinnerComponent",
    props: ["start"],
}
</script>

<style>
.spin {
    z-index: 10;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
}
.ring {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 auto;
    height: 100%;
}
.lds-circle {
    display: inline-block;
    transform: translateZ(1px);
}
.lds-circle > div {
    display: inline-block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    background: #fff;
    animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
@keyframes lds-circle {
    0%, 100% {
        animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
    }
    0% {
        transform: rotateY(0deg);
    }
    50% {
        transform: rotateY(1800deg);
        animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
    }
    100% {
        transform: rotateY(3600deg);
    }
}
</style>