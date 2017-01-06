'use strict'
import THREE from 'three'
var data = []
var jump = [
  [
    {
      plane: (function () {
        let plane = new THREE.Mesh(new THREE.SphereGeometry(40, 6, 6), new THREE.MeshBasicMaterial({color: 0x000}))
        plane.position.x = -300
        plane.position.z = 590
        plane.position.y = -120
        return plane
      })(),
      jumpto: 1
    }, {
      plane: (function () {
        let plane = new THREE.Mesh(new THREE.SphereGeometry(40, 6, 6), new THREE.MeshBasicMaterial({color: 0x000}))
        plane.position.x = -530
        plane.position.z = 190
        plane.position.y = -70
        return plane
      })(),
      jumpto: 2
    }
  ],
  [
    {
      plane: (function () {
        let plane = new THREE.Mesh(new THREE.SphereGeometry(70, 6, 6), new THREE.MeshBasicMaterial({color: 0x000}))
        plane.position.x = -600
        plane.position.z = 130
        plane.position.y = -150
        return plane
      })(),
      jumpto: 0
    }
  ],
  [
    {
      plane: (function () {
        let plane = new THREE.Mesh(new THREE.SphereGeometry(70, 6, 6), new THREE.MeshBasicMaterial({color: 0x000}))
        plane.position.x = -550
        plane.position.z = -140
        plane.position.y = -150
        return plane
      })(),
      jumpto: 3
    }
  ],
  [
    {
      plane: (function () {
        let plane = new THREE.Mesh(new THREE.SphereGeometry(70, 6, 6), new THREE.MeshBasicMaterial({color: 0x000}))
        plane.position.x = -500
        plane.position.z = -350
        plane.position.y = -150
        return plane
      })(),
      jumpto: 4
    }
  ],
  [
    {
      plane: (function () {
        let plane = new THREE.Mesh(new THREE.SphereGeometry(60, 6, 6), new THREE.MeshBasicMaterial({color: 0x000}))
        plane.position.x = -250
        plane.position.z = -450
        plane.position.y = -350
        return plane
      })(),
      jumpto: 5
    }
  ],
  [
    {
      plane: (function () {
        let plane = new THREE.Mesh(new THREE.SphereGeometry(70, 6, 6), new THREE.MeshBasicMaterial({color: 0x000}))
        plane.position.x = -600
        plane.position.z = 80
        plane.position.y = -120
        return plane
      })(),
      jumpto: 6
    }
  ],
  [
    {
      plane: (function () {
        let plane = new THREE.Mesh(new THREE.SphereGeometry(50, 6, 6), new THREE.MeshBasicMaterial({color: 0x000}))
        plane.position.x = 560
        plane.position.z = -50
        plane.position.y = -120
        return plane
      })(),
      jumpto: 7
    }
  ],
  [
    {
      plane: (function () {
        let plane = new THREE.Mesh(new THREE.SphereGeometry(50, 6, 6), new THREE.MeshBasicMaterial({color: 0x000}))
        plane.position.x = -550
        plane.position.z = 0
        plane.position.y = -120
        return plane
      })(),
      jumpto: 8
    }
  ],
  [
    {
      plane: (function () {
        let plane = new THREE.Mesh(new THREE.SphereGeometry(70, 6, 6), new THREE.MeshBasicMaterial({color: 0x000}))
        plane.position.x = -50
        plane.position.z = -550
        plane.position.y = -2800
        return plane
      })(),
      jumpto: 8
    }
  ]
]
var latConstrains = [
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15
]
var fovMaxs = [
  70,
  70,
  70,
  70,
  70,
  70,
  70,
  70,
  70
]
var fields = [
  4,
  4,
  2,
  2,
  2,
  0,
  0,
  0,
  5
]
var initLons = [
  -10,
  -7,
  -18,
  0,
  15,
  -19,
  -136,
  -20,
  0
]

var lonmins = [
  -20,
  -20,
  -20,
  -20,
  -20,
  -20,
  NaN,
  -20,
  -20
]
var lonmaxs = [
  20,
  20,
  20,
  20,
  20,
  20,
  NaN,
  20,
  20
]
for (var i = 0; i < 9; i++) {
  data.push({
    path: './imgs/' + (i + 1) + '.jpg',
    index: i,
    jump: jump[i],
    latConstrain: latConstrains[i],
    fovMax: fovMaxs[i],
    initLon: initLons[i],
    lonmin: lonmins[i],
    lonmax: lonmaxs[i],
    field: fields[i]
  })
}

module.exports = data
