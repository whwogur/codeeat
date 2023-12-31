import Phaser from 'phaser'
import Network from '../services/Network'
import DMNetwork from '../services/DMNetwork'
import store from '../stores'
import { setRoomJoined } from '../stores/RoomStore'
import { BackgroundMode } from '../../../types/BackgroundMode'
import GameNetwork from '../services/GameNetwork'

export default class Bootstrap extends Phaser.Scene {
  private preloadComplete = false
  network!: Network
  dmNetwork!: DMNetwork
  gameNetwork!: GameNetwork

  constructor() {
    super('bootstrap')
  }

  preload() {
    this.load.atlas(
      'cloud_day',
      'assets/background/cloud_day.png',
      'assets/background/cloud_day.json'
    )
    this.load.image('backdrop_day', 'assets/background/backdrop_day.png')
    this.load.atlas(
      'cloud_night',
      'assets/background/cloud_night.png',
      'assets/background/cloud_night.json'
    )
    this.load.image('backdrop_night', 'assets/background/backdrop_night.png')
    this.load.image('sun_moon', 'assets/background/sun_moon.png')

    // this.load.tilemapTiledJSON('tilemap', 'assets/map/map.json')
    this.load.tilemapTiledJSON('tilemap', 'assets/map/codeEatMapFix.json')
    // this.load.spritesheet('tiles_wall', 'assets/map/FloorAndGround.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // })

    // codeEatMapFix //////
    this.load.spritesheet('bench', 'assets/items/bench.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('codeEatChair', 'assets/items/codeEatChair.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('mole', 'assets/items/mole.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('picnic2', 'assets/items/picnic2.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('gamesign', 'assets/items/gamesign.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('buildings', 'assets/tileset/buildings.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('foreground', 'assets/tileset/foreground.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('ground', 'assets/tileset/ground.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('secondlayer', 'assets/tileset/secondlayer.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('shadow', 'assets/tileset/shadow.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    this.load.spritesheet('wall', 'assets/tileset/wall.png', {
      frameWidth: 16,
      frameHeight: 16,
    })

    // this.load.spritesheet('adam', 'assets/character/adam.png', {
    //   frameWidth: 32,
    //   frameHeight: 48,
    // })
    // this.load.spritesheet('ash', 'assets/character/ash.png', {
    //   frameWidth: 32,
    //   frameHeight: 48,
    // })
    // this.load.spritesheet('lucy', 'assets/character/lucy.png', {
    //   frameWidth: 32,
    //   frameHeight: 48,
    // })
    // this.load.spritesheet('nancy', 'assets/character/nancy.png', {
    //   frameWidth: 32,
    //   frameHeight: 48,
    // })

    // ***새롭게 16px 캐릭터로 변경하기 위한 코드***
    this.load.spritesheet('noah', 'assets/character/noah.png', {
      frameWidth: 16,
      frameHeight: 32,
    })
    this.load.spritesheet('nora', 'assets/character/nora.png', {
      frameWidth: 16,
      frameHeight: 32,
    })
    this.load.spritesheet('maya', 'assets/character/maya.png', {
      frameWidth: 16,
      frameHeight: 32,
    })
    this.load.spritesheet('owen', 'assets/character/owen.png', {
      frameWidth: 16,
      frameHeight: 32,
    })
    this.load.spritesheet('jiji', 'assets/character/jiji.png', {
      frameWidth: 16,
      frameHeight: 32,
    })
    this.load.spritesheet('john', 'assets/character/john.png', {
      frameWidth: 16,
      frameHeight: 32,
    })
    this.load.spritesheet('mina', 'assets/character/mina.png', {
      frameWidth: 16,
      frameHeight: 32,
    })
    this.load.spritesheet('ryan', 'assets/character/ryan.png', {
      frameWidth: 16,
      frameHeight: 32,
    })

    this.load.on('complete', () => {
      this.preloadComplete = true
      this.launchBackground(store.getState().user.backgroundMode)
    })
  }

  init() {
    this.network = new Network()
    this.dmNetwork = new DMNetwork()
    this.gameNetwork = new GameNetwork()
  }

  private launchBackground(backgroundMode: BackgroundMode) {
    this.scene.launch('background', { backgroundMode })
  }

  launchGame() {
    if (!this.preloadComplete) return
    // this.network.webRTC?.checkPreviousPermission()
    this.scene.launch('game', {
      network: this.network,
      dmNetwork: this.dmNetwork,
    })

    // update Redux state
    store.dispatch(setRoomJoined(true))
  }

  changeBackgroundMode(backgroundMode: BackgroundMode) {
    this.scene.stop('background')
    this.launchBackground(backgroundMode)
  }
}
