<template>
    <a class="btn btn-plain">
        <slot></slot>
    </a>
</template>

<script>
    export default {
        name: 'AButton',
        data() {
            return{}
        }
    }
</script>

<style lang="scss" scoped>
    .btn {
        color: #fff;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        padding: 6px 20px;
        max-width: 160px;
        position: relative;
        text-decoration: none;
        width: 100%;
        background-color: rgba(50, 47, 98, .5);
    }

    .btn + .btn {
        margin-left: 10px;
    }

    .btn-plain {
        border: 1px solid #333077;
        box-shadow: inset 0 0 20px rgba(101, 109, 242, 0);
        outline: 1px solid;
        outline-color: rgba(101, 109, 242, .5);
        outline-offset: 0px;
        text-shadow: none;
        transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
        box-sizing: border-box;

        &:hover {
            border: 1px solid #656DF2;
            box-shadow: inset 0 0 20px rgba(101, 109, 242, .5), 0 0 20px rgba(101, 109, 242, .2);
            outline-color: rgba(101, 109, 242, 0);
            outline-offset: 15px;
            text-shadow: 1px 1px 2px #427388;
        }

    }
</style>
