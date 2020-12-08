<template>
  <div class="game-container" :style="{'grid-template-columns': gridTemplate}">
    <div class="block" v-for="block in blockList" :key="block.index">
      {{ block.index }}
    </div>
    <div
      class="active-block"
      :class="'row-' + activeBlock.rowIndex + '-col-' + activeBlock.colIndex"
      v-for="activeBlock in activeBlockList"
      :style="{width: activeBlockWidth, height: activeBlockWidth}"
      :key="activeBlock.index"
    >
      {{ activeBlock.val }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: 20,
      dimension: 4,
      blockList: [],
      activeBlockList: [],
    }
  },
  computed: {
    gridTemplate() {
      return `repeat(${this.dimension}, 1fr)`
    },
    activeBlockWidth() {
      const length = (300 - 16 * (this.dimension - 1)) / this.dimension
      return length + 'px'
    },
  },
  methods: {
    initGame() {
      this.initBlockList()
      this.bindControl()
      this.activeBlockList.push(this.createActiveBlock())
      this.activeBlockList.push(this.createActiveBlock())
      this.activeBlockList.push(this.createActiveBlock())
      this.activeBlockList.push(this.createActiveBlock())
      this.activeBlockList.push(this.createActiveBlock())
    },
    initBlockList() {
      const {dimension} = this
      const list = []
      for (let rowIndex = 0; rowIndex < dimension; rowIndex++) {
        for (let colIndex = 0; colIndex < dimension; colIndex++) {
          const block = this.initBlock()
          block.index = rowIndex * dimension + colIndex
          list.push(block)
        }
      }
      this.blockList = list
    },

    getRandomIndex() {
      const rowIndex = Math.floor(Math.random() * this.dimension)
      const colIndex = Math.floor(Math.random() * this.dimension)
      return {rowIndex, colIndex}
    },
    createActiveBlock() {
      let position
      do {
        position = this.getRandomIndex()
      } while (this.alreadyHasBlock(position))
      position.index = this.index
      position.val = this.index++
      return position
    },
    alreadyHasBlock(position) {
      return this.activeBlockList.some(block => {
        return (
          block.rowIndex == position.rowIndex &&
          block.colIndex == position.colIndex
        )
      })
    },
    initBlock() {
      const block = {
        val: 2,
      }
      return block
    },
    bindControl() {
      document.addEventListener('keydown', event => {
        switch (event.key) {
          case 'w':
            this.pressW()
            // this.activeBlockList[0].rowIndex = 1
            break
          case 'a':
            this.pressA()
            break
          case 's':
            this.pressS()
            break
          case 'd':
            this.pressD()
            break
          default:
        }
      })
    },
    pressW() {
      this.activeBlockList.forEach(block => {
        const currentRowIndex = block.rowIndex
        // let
        if (
          this.activeBlockList.some(v => {
            return v.rowIndex == currentRowIndex
          })
        ) {
          //
        }
        block.rowIndex = 0
      })
    },
    pressA() {
      this.activeBlockList.forEach(block => {
        block.colIndex = 0
      })
    },
    pressS() {
      this.activeBlockList.forEach(block => {
        block.rowIndex = this.dimension - 1
      })
    },
    pressD() {
      this.activeBlockList.forEach(block => {
        block.colIndex = this.dimension - 1
      })
    },
  },
  mounted() {
    // this.initBlockList()
    // this.bindControl()
    this.initGame()
  },
}
</script>

<style lang="less" scoped>
.game-container {
  position: relative;
  width: 300px;
  height: 300px;
  display: grid;
  background: green;
  gap: 16px;
  padding: 16px;

  .block {
    padding: 8px;
    font-size: 2em;
    text-align: center;
    background: orange;
  }

  .active-block {
    position: absolute;
    background: red;
    font-size: 2em;
    padding: 8px;
    box-sizing: border-box;
  }

  // 计算出的transform
  .row-0-col-0 {
    transform: translate(16px, 16px);
  }

  .row-0-col-1 {
    transform: translate(95px, 16px);
  }

  .row-0-col-2 {
    transform: translate(174px, 16px);
  }

  .row-0-col-3 {
    transform: translate(253px, 16px);
  }

  .row-1-col-0 {
    transform: translate(16px, 95px);
  }

  .row-1-col-1 {
    transform: translate(95px, 95px);
  }

  .row-1-col-2 {
    transform: translate(174px, 95px);
  }

  .row-1-col-3 {
    transform: translate(253px, 95px);
  }

  .row-2-col-0 {
    transform: translate(16px, 174px);
  }

  .row-2-col-1 {
    transform: translate(95px, 174px);
  }

  .row-2-col-2 {
    transform: translate(174px, 174px);
  }

  .row-2-col-3 {
    transform: translate(253px, 174px);
  }

  .row-3-col-0 {
    transform: translate(16px, 253px);
  }

  .row-3-col-1 {
    transform: translate(95px, 253px);
  }

  .row-3-col-2 {
    transform: translate(174px, 253px);
  }

  .row-3-col-3 {
    transform: translate(253px, 253px);
  }
}
</style>
