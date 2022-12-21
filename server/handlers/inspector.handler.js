const Inspector = require('../models/inspector.model');

const software = ['USB Disk Security'];

module.exports = (io, socket) => {
  const findAll = async (payload, callback) => {
    try {
      const items = await Inspector.aggregate([
        {
          $addFields: {
            id: '$_id',
            hdd: {
              $reduce: {
                input: '$diskdrive',
                initialValue: 0,
                in: {
                  $sum: [
                    {
                      $convert: {
                        input: '$$this.Size',
                        to: 'long',
                        onError: 0,
                        onNull: 0
                      }
                    },
                    '$$value'
                  ]
                }
              }
            },
            ram: {
              $reduce: {
                input: '$memorychip',
                initialValue: 0,
                in: {
                  $sum: [
                    {
                      $convert: {
                        input: '$$this.Capacity',
                        to: 'long',
                        onError: 0,
                        onNull: 0
                      }
                    },
                    '$$value'
                  ]
                }
              }
            },
            cpu: '$cpu.Name',
            system: {
              csname: '$os.CSName',
              osname: '$os.Caption',
              platform: '$os.OSArchitecture',
              version: '$os.Version'
            },
            updated: '$updatedAt',
            total: {
              useraccount: {
                $size: { $ifNull: ['$useraccount', []] }
              },
              product: {
                $size: { $ifNull: ['$product', []] }
              },
              share: {
                $size: { $ifNull: ['$share', []] }
              }
            },
            share: {
              $filter: {
                input: '$share',
                as: 'item',
                cond: {
                  $and: [
                    {
                      $ne: ['$$item.Name', 'print$']
                    },
                    {
                      $ne: ['$$item.Name', 'prnproc$']
                    }
                  ]
                }
              }
            },
            useraccount: {
              $filter: {
                input: '$useraccount',
                as: 'item',
                cond: {
                  $and: [
                    {
                      $ne: ['$$item.Disabled', 1]
                    },
                    {
                      $ne: ['$$item.Name', 'toarm']
                    },
                    {
                      $ne: ['$$item.Name', 'avpz']
                    },
                    {
                      $ne: ['$$item.Name', 'admasuf']
                    },
                    {
                      $ne: ['$$item.Name', 'asuf']
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $project: {
            id: 1,
            _id: 0,
            cpu: 1,
            ram: 1,
            hdd: 1,
            host: 1,
            system: 1,
            updated: 1,
            total: 1,
            warnings: {
              share: {
                $cond: {
                  if: {
                    $gt: [
                      {
                        $size: {
                          $setIntersection: ['$share.Type', [0]]
                        }
                      },
                      0
                    ]
                  },
                  then: true,
                  else: false
                }
              },
              useraccount: {
                $cond: {
                  if: {
                    $gt: [
                      {
                        $size: {
                          $setIntersection: ['$useraccount.Name', '$useradmin']
                        }
                      },
                      0
                    ]
                  },
                  then: true,
                  else: false
                }
              },
              product: {
                $cond: {
                  if: {
                    $gt: [
                      {
                        $size: {
                          $setIntersection: ['$share.Type', []]
                        }
                      },
                      0
                    ]
                  },
                  then: true,
                  else: false
                }
              }
              // product: {
              //   $cond: {
              //     if: {
              //       $gt: [
              //         {
              //           $size: {
              //             $setIntersection: ['$product.Name', software]
              //           }
              //         },
              //         0
              //       ]
              //     },
              //     then: true,
              //     else: false
              //   }
              // }
            }
          }
        },
        {
          $sort: {
            updated: -1
          }
        }
      ]).allowDiskUse(true);
      callback(items);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const findOne = async (payload, callback) => {
    try {
      const item = await Inspector.findById(payload.id);
      if (item) callback(item);
      else callback(404);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const createOne = async (payload, callback) => {
    try {
      const ipaddress = socket.remoteAddress;
      const item = await Inspector.findOneAndUpdate(
        {
          host: ipaddress
        },
        {
          host: ipaddress,
          [payload.field]:
            payload.type === 'object' ? payload[payload.field][0] : payload[payload.field]
        },
        {
          new: true,
          upsert: true,
          rawResult: true
        }
      );
      callback(item);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const updateOne = async (payload, callback) => {
    try {
      const item = await Inspector.findByIdAndUpdate(payload.id, {
        $set: {
          ...payload
        }
      });
      if (item) callback(item);
      else callback(400);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  const removeOne = async (payload, callback) => {
    try {
      const item = await Inspector.deleteOne({ _id: payload.id });
      if (item) callback(item);
      else callback(404);
    } catch (err) {
      callback({ error: err.message });
    }
  };

  socket.on('inspector:find:all', findAll);
  socket.on('inspector:find:one', findOne);
  socket.on('inspector:create:one', createOne);
  socket.on('inspector:update:one', updateOne);
  socket.on('inspector:remove:one', removeOne);
};
