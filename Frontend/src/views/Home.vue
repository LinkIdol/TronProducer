<template>
    <div class="home-page">
        <div class="fixed-width">
            <div style="display: flex;justify-content: space-between;">
                <div style="width: 350px;">
                    <img src="../assets/title.png" alt="" style="width: 100%;">
                </div>
                <div style="width: 500px;">
                    <img src="../assets/idol5.png" alt="" style="width: 100%;">
                </div>
            </div>
            <div class="content-container">
                <div class="content-inner">
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
            <div style="display: flex;flex-wrap: wrap;justify-content: space-between;margin-top: 6rem;">
                <div class="step-box">
                    <div style="margin-left: 30px">
                        <p>
                            <span style="color: #F8E71C;font-weight: bolder;font-size: 22px;">{{$t('step')}}1:</span>
                            <span style="font-size: 18px;margin-left: 10px;">{{$t('step1')}}</span>
                        </p>
                    </div>
                    <div style="display: flex;flex-direction: row;align-items: center;margin-top: 80px;margin-left: 160px;">
                        <div style="width: 20px;margin-right: 20px;">
                            <img src="../assets/bar-code.png" alt="" style="width: 100%;">
                        </div>
                        <div style="width: 130px;">
                            <img src="../assets/gan-net.png" alt="" style="width: 100%;">
                        </div>
                    </div>
                </div>

                <div class="step-box">
                    <div style="margin-left: 30px">
                        <p>
                            <span style="color: #F8E71C;font-weight: bolder;font-size: 22px;">{{$t('step')}}2:</span>
                            <span style="font-size: 18px;margin-left: 10px;">{{$t('step2')}}</span>
                        </p>
                    </div>
                    <div style="display: flex;flex-direction: row;align-items: center;margin-top: 70px;margin-left: 100px;">
                        <div style="width: 280px;">
                            <img src="../assets/gan-girl.png" alt="" style="width: 100%;">
                        </div>
                    </div>
                </div>

                <div class="step-box">
                    <div style="margin-left: 30px">
                        <p>
                            <span style="color: #F8E71C;font-weight: bolder;font-size: 22px;">{{$t('step')}}3:</span>
                            <span style="font-size: 18px;margin-left: 10px;">{{$t('step3')}}</span>
                        </p>
                    </div>
                    <div style="display: flex;flex-direction: row;align-items: center;margin-top: 100px;margin-left: 100px;">
                        <div style="width: 280px;">
                            <img src="../assets/gan-girl3.png" alt="" style="width: 100%;">
                        </div>
                    </div>
                </div>

                <div class="step-box">
                    <div style="margin-left: 30px">
                        <p>
                            <span style="color: #F8E71C;font-weight: bolder;font-size: 22px;">{{$t('step')}}4:</span>
                            <span style="font-size: 18px;margin-left: 10px;">{{$t('step4')}}</span>
                        </p>
                    </div>
                    <div style="display: flex;flex-direction: row;align-items: center;margin-top: 70px;margin-left: 130px;">
                        <div style="width: 125px;">
                            <img src="../assets/gan-girl4.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <img src="../assets/earth3.png" alt="">
        </div>
    </div>
</template>
<style lang="scss" scoped>
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
</style>
