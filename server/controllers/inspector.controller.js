const Inspector = require('../models/inspector.model');

const software = ['USB Disk Security'];

const findAll = async (req, res, next) => {
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

    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    const item = await Inspector.findById(req.params.id);
    if (item) res.status(200).json(item);
    else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

const createOne = async (req, res, next) => {
  try {
    const ipaddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await Inspector.findOneAndUpdate(
      {
        host: ipaddress
      },
      {
        host: ipaddress,
        [req.query.field]:
          req.query.type === 'object' ? req.body[req.query.field][0] : req.body[req.query.field]
      },
      {
        new: true,
        upsert: true,
        rawResult: true
      }
    );
    res.status(200).end();
  } catch (err) {
    next(err);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const item = await Inspector.findByIdAndUpdate(req.params.id, {
      $set: {
        ...req.body
      }
    });
    if (item) res.status(200).json(item);
    else res.sendStatus(400);
  } catch (err) {
    next(err);
  }
};

const removeOne = async (req, res, next) => {
  try {
    const item = await Inspector.deleteOne({ _id: req.params.id });
    if (item) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  findAll,
  findOne,
  createOne,
  updateOne,
  removeOne
};
