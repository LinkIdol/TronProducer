<template>
    <div class="home-page">
        <div class="fixed-width">
            <div class="topImgContainer">
                <div class="titleImg">
                    <img src="../assets/title.png" alt="" style="width: 100%;">
                </div>
                <div class="idol5Img">
                    <img src="../assets/idol5.png" alt="" style="width: 100%;">
                </div>
            </div>
            <div class="content-container">
                <div class="content-box">
                    <div class="subtitle">
                        <div style="width: 25px;">
                            <img src="../assets/subtitle-prefix.png" alt="" style="width: 100%;">
                        </div>
                        <p>{{$t('AI')}}</p>
                    </div>
                    <div class="subContent">
                        <p>{{$t('AI_subtitle')}}</p>
                    </div>
                </div>
                <div class="content-box">
                    <div class="subtitle">
                        <div style="width: 25px;">
                            <img src="../assets/subtitle-prefix.png" alt="" style="width: 100%;">
                        </div>
                        <p>{{$t('blockChain')}}</p>
                    </div>
                    <div class="subContent">
                        <p>{{$t('blockChain_subtitle')}}</p>
                    </div>
                </div>
                <div class="content-box">
                    <div class="subtitle">
                        <div style="width: 25px;">
                            <img src="../assets/subtitle-prefix.png" alt="" style="width: 100%;">
                        </div>
                        <p>{{$t('animate')}}</p>
                    </div>
                    <div class="subContent">
                        <p>{{$t('animate_subtitle')}}</p>
                    </div>
                </div>
            </div>
            <div class="step-container">
                <div class="step-box">
                    <div class="step-title">
                        <p>
                            <span class="tutorial-title">TwinGAN results</span>
                        </p>
                    </div>
                    <div class="step-image step1">
                        <div class="step-image-inner">
                            <img src="../assets/tutorial-step1.png" alt="" style="width: 100%;">
                        </div>
                    </div>
                </div>

                <div class="step-box">
                    <div class="step-title">
                        <p>
                            <span class="tutorial-title">Identify Preservation</span>
                        </p>
                    </div>
                    <div class="step-image step2">
                        <div class="step-image-inner">
                            <img src="../assets/tutorial-step2.png" alt="" style="width: 100%;">
                        </div>
                    </div>
                </div>

                <div class="step-box">
                    <div class="step-title">
                        <p>
                            <span class="tutorial-title">As a Search Engine</span>
                        </p>
                    </div>
                    <div class="step-image step3">
                        <div class="step-image-inner">
                            <img src="../assets/tutorial-step3.png" alt="" style="width: 100%;">
                        </div>
                    </div>
                </div>

                <div class="step-box">
                    <div class="step-title">
                        <p>
                            <span class="tutorial-title">Meow GAN</span>
                        </p>
                    </div>
                    <div class="step-image step4">
                        <div class="step-image-inner">
                            <img src="../assets/tutorial-step4.png" alt="" style="width: 100%;">
                        </div>
                    </div>
                </div>
            </div>
            <img class="earthImg" src="../assets/earth3.png" alt="">
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .step-image-inner {
        width: 350px;
    }
    .step4 {
        margin-top: 80px;
        margin-left: 60px;
    }
    .step3 {
        margin-top: 60px;
        margin-left: 60px;
    }
    .step2 {
        margin-top: 100px;
        margin-left: 60px;
    }
    .step1 {
        margin-top: 80px;
        margin-left: 60px;
    }
    .step-image {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .step-title {
        margin-left: 30px;
    }
    .step-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 6rem;
    }
    .topImgContainer {
        display: flex;
        justify-content: space-between;
    }
    .titleImg {
        width: 350px;
    }
    .idol5Img {
        width: 500px;
    }
    .tutorial-title {
        color: #F8E71C;
        font-weight: bolder;
        font-size: 28px;
    }
    .step-box {
        background-image: url("../assets/box-container.png");
        background-repeat: no-repeat;
        width: 449px;
        height: 303px;
        margin-bottom: 4rem;
    }
    .home-page {
        color: #fff;
        margin-top: 4rem;
        font-size: 14px;
    }
    .subtitle {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        margin-bottom: 10px;
        p {
            margin-left: 10px;
        }
    }
    .subContent {
        width: 200px;
        font-size: 14px;
    }
    .content-box {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .content-container {
        display: flex;
        justify-content: space-between;
        padding: 20px;
        margin-top: 8rem;
    }
    p {
        margin: 0;
    }

    @media screen and (max-width: $mediaWidth) {
        .topImgContainer {
            flex-direction: column;
            align-items: center;
        }
        .titleImg {
            width: 80%;
        }
        .idol5Img {
            width: 90%;
            margin-top: 1rem;
        }
        .home-page {
            margin-top: 0;
        }
        .content-container {
            flex-direction: column;
            align-items: center;
            margin-top: 2rem;
        }
        .subContent {
            width: 100%;
            max-width: 600px;
        }
        .content-box {
            margin-bottom: 4rem;
        }
        .step-container {
            align-items: center;
            justify-content: center;
            margin-top: 2rem;
        }
        .step-box {
            max-width: 449px;
            width: 80%;
            height: auto;
            background-size: contain;
            margin-bottom: 2rem;
        }
        .step-title {
            margin-left: 0;
            margin-top: -1vw;
        }
        .tutorial-title {
            font-size: 4.5vw;
        }
        .step1, .step3, .step4 {
            margin: 0;
            padding: 60px 40px 40px 60px;
        }
        .step2 {
            margin: 0;
            padding: 60px 30px 40px 40px;
        }
        .earthImg {
            display: none;
        }
    }
</style>
