const User = require('../models/user.model');
const Inspector = require('../models/inspector.model');
const Request = require('../models/request.model');
const IPAddress = require('../models/ipaddress.model');
const Channel = require('../models/channel.model');
const Сompany = require('../models/company.model');
const Branch = require('../models/branch.model');
const Enterprise = require('../models/enterprise.model');
const Department = require('../models/department.model');
const Position = require('../models/position.model');
const Location = require('../models/location.model');
const Unit = require('../models/unit.model');
const VPN = require('../models/vpn.model');

const ipaddress = async (req, res, next) => {
  try {
    const [
      channels,
      companies,
      branches,
      enterprises,
      locations,
      units,
      vpns,
      statistic,
      barUnits,
      barLocations,
      barBranches,
      barEnterprises
    ] = await Promise.all([
      Channel.countDocuments(),
      Сompany.countDocuments(),
      Branch.countDocuments(),
      Enterprise.countDocuments(),
      Location.countDocuments(),
      Unit.countDocuments(),
      VPN.countDocuments(),

      IPAddress.aggregate([
        {
          $facet: {
            count: [
              {
                $count: 'count'
              }
            ],
            autoanswer: [
              {
                $match: {
                  $and: [
                    {
                      autoanswer: {
                        $ne: ''
                      }
                    },
                    {
                      autoanswer: {
                        $ne: '-'
                      }
                    },
                    {
                      autoanswer: {
                        $ne: null
                      }
                    }
                  ]
                }
              },
              {
                $count: 'autoanswer'
              }
            ],
            internet: [
              {
                $match: {
                  $and: [
                    {
                      'internet.mail': {
                        $ne: null
                      }
                    },
                    {
                      'internet.dateOpen': {
                        $ne: null
                      }
                    },
                    {
                      'internet.dateClose': null
                    }
                  ]
                }
              },
              {
                $count: 'internet'
              }
            ],
            email: [
              {
                $match: {
                  $and: [
                    {
                      'email.mail': {
                        $ne: null
                      }
                    },
                    {
                      'email.dateOpen': {
                        $ne: null
                      }
                    },
                    {
                      'email.dateClose': null
                    }
                  ]
                }
              },
              {
                $count: 'email'
              }
            ]
          }
        },
        {
          $addFields: {
            count: {
              $first: '$count.count'
            },
            autoanswer: {
              $first: '$autoanswer.autoanswer'
            },
            internet: {
              $first: '$internet.internet'
            },
            email: {
              $first: '$email.email'
            }
          }
        }
      ]).allowDiskUse(true),

      IPAddress.aggregate([
        {
          $lookup: {
            from: 'units',
            localField: 'unit',
            foreignField: '_id',
            as: 'unit'
          }
        },
        {
          $unwind: {
            path: '$unit',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$unit.title',
            count: {
              $sum: 1
            }
          }
        },
        {
          $project: {
            _id: 0,
            title: '$_id',
            count: 1
          }
        }
      ]).allowDiskUse(true),
      IPAddress.aggregate([
        {
          $lookup: {
            from: 'locations',
            localField: 'location',
            foreignField: '_id',
            as: 'location'
          }
        },
        {
          $unwind: {
            path: '$location',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$location.title',
            count: {
              $sum: 1
            }
          }
        },
        {
          $project: {
            _id: 0,
            title: '$_id',
            count: 1
          }
        }
      ]).allowDiskUse(true),
      IPAddress.aggregate([
        {
          $lookup: {
            from: 'branches',
            localField: 'branch',
            foreignField: '_id',
            as: 'branch'
          }
        },
        {
          $unwind: {
            path: '$branch',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$branch.title',
            count: {
              $sum: 1
            }
          }
        },
        {
          $project: {
            _id: 0,
            title: '$_id',
            count: 1
          }
        }
      ]).allowDiskUse(true),
      IPAddress.aggregate([
        {
          $lookup: {
            from: 'enterprises',
            localField: 'enterprise',
            foreignField: '_id',
            as: 'enterprise'
          }
        },
        {
          $unwind: {
            path: '$enterprise',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$enterprise.title',
            count: {
              $sum: 1
            }
          }
        },
        {
          $project: {
            _id: 0,
            title: '$_id',
            count: 1
          }
        }
      ]).allowDiskUse(true)
    ]);

    res.status(200).json({
      ...statistic[0],
      channels,
      companies,
      branches,
      enterprises,
      locations,
      units,
      vpns,

      barUnits,
      barLocations,
      barBranches,
      barEnterprises
    });
  } catch (err) {
    next(err);
  }
};

const request = async (req, res, next) => {
  try {
    const [requests, companies, branches, enterprises, departments, locations, positions, units] =
      await Promise.all([
        Request.countDocuments(),
        Сompany.countDocuments(),
        Branch.countDocuments(),
        Enterprise.countDocuments(),
        Department.countDocuments(),
        Location.countDocuments(),
        Position.countDocuments(),
        Unit.countDocuments()
      ]);

    res.status(200).json({
      requests,
      companies,
      branches,
      enterprises,
      departments,
      locations,
      positions,
      units
    });
  } catch (err) {
    next(err);
  }
};

const inspector = async (req, res, next) => {
  try {
    const companies = await Сompany.countDocuments();
    const branches = await Branch.countDocuments();
    const enterprises = await Enterprise.countDocuments();
    const locations = await Location.countDocuments();

    const count = await Inspector.countDocuments();

    const warnings = await Inspector.aggregate([
      {
        $addFields: {
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
          _id: 0,
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
                        $setIntersection: ['$product.Name', ['USB Disk Security']]
                      }
                    },
                    0
                  ]
                },
                then: true,
                else: false
              }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          useraccount: {
            $sum: {
              $cond: [
                {
                  $eq: ['$warnings.useraccount', true]
                },
                1,
                0
              ]
            }
          },
          product: {
            $sum: {
              $cond: [
                {
                  $eq: ['$warnings.product', true]
                },
                1,
                0
              ]
            }
          },
          share: {
            $sum: {
              $cond: [
                {
                  $eq: ['$warnings.share', true]
                },
                1,
                0
              ]
            }
          }
        }
      },

      {
        $project: {
          _id: 0,
          useraccount: 1,
          product: 1,
          share: 1
        }
      }
    ]).allowDiskUse(true);

    const days = await Inspector.aggregate([
      {
        $bucket: {
          groupBy: '$updatedAt',
          boundaries: [
            new Date(new Date().valueOf() - 30 * (1000 * 60 * 60 * 24)),
            new Date(new Date().valueOf() - 15 * (1000 * 60 * 60 * 24)),
            new Date(new Date().valueOf() - 7 * (1000 * 60 * 60 * 24)),
            new Date(new Date().valueOf() - 1 * (1000 * 60 * 60 * 24))
          ],
          default: new Date(new Date().valueOf() - 31 * (1000 * 60 * 60 * 24)),
          output: {
            count: { $sum: 1 }
          }
        }
      },
      {
        $addFields: {
          days: {
            $divide: [{ $subtract: [new Date(), '$_id'] }, 1000 * 60 * 60 * 24]
          }
        }
      },
      {
        $project: {
          _id: 0,
          days: 1,
          count: 1
        }
      },
      {
        $sort: {
          days: 1
        }
      }
    ]).allowDiskUse(true);

    res.status(200).json({
      count,
      companies,
      branches,
      enterprises,
      locations,
      ...warnings[0],
      days
    });
  } catch (err) {
    next(err);
  }
};

const dashboard = async (req, res, next) => {
  try {
    const [
      users,
      inspectors,
      requests,
      onmaps,
      ipaddress,
      channels,
      companies,
      branches,
      enterprises,
      departments,
      positions,
      locations,
      units,
      vpns
    ] = await Promise.all([
      User.countDocuments(),
      Inspector.countDocuments(),
      Request.countDocuments(),
      IPAddress.countDocuments(),
      Channel.countDocuments(),
      Сompany.countDocuments(),
      Branch.countDocuments(),
      Enterprise.countDocuments(),
      Department.countDocuments(),
      Position.countDocuments(),
      Location.countDocuments(),
      Unit.countDocuments(),
      VPN.countDocuments()
    ]);

    res.status(200).json({
      users,
      inspectors,
      requests,
      ipaddress,
      channels,
      companies,
      branches,
      enterprises,
      departments,
      positions,
      locations,
      units,
      vpns
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { ipaddress, request, inspector, dashboard };
