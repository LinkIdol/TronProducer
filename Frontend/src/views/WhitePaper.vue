<template>
    <div class="about fixed-width" v-html="this.$t('WHITE_PAPER')">

    </div>
</template>
<style lang="scss" scoped>
    .about {
        color: #fff;
        margin-top: 3rem;
        margin-bottom: 10rem;
    }
    @media screen and (max-width: $mediaWidth) {
        .about {
            color: #fff;
            margin-top: 0;
            margin-bottom: 0;
        }
    }
</style>
