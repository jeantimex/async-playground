import async from 'async';

const database = {
  policies: {
    pagination: {
      previousMarker: null,
      nextMarker: null,
    },
    data: [
      {
        type: 'retention_policy',
        id: '1',
      },
      {
        type: 'retention_policy',
        id: '2',
      },
    ],
  },
  details: {
    type: 'retention_policy',
    id: '123456789',
    policy_name: 'Tax Documents',
    policy_type: 'finite',
    retention_length: 365,
    disposition_action: 'remove_retention',
    status: 'active',
    created_by: {
      type: 'user',
      id: '11993747',
      name: 'Sean',
      login: 'sean@box.com',
    },
    created_at: '2015-05-01T11:12:54-07:00',
    modified_at: '2015-06-08T11:11:50-07:00',
  },
};

const getPolicies = new Promise((resolve, reject) => {
  setTimeout(() => {
    // do a thing, possibly async, then...
    const isOk = true;

    if (isOk) {
      // const { pagination, data } = policies;
      // const ids = data.map(item => item.id);
      resolve(database.policies);
    } else {
      reject(Error('It broke'));
    }
  }, 200);
});

const getDetails = new Promise((resolve, reject) => {
  setTimeout(() => {
    const isOk = true;

    if (isOk) {
      resolve(database.details);
    } else {
      reject(Error('It broke'));
    }
  }, 100);
});

async.waterfall(
  [
    // Firstly call to retrieve all the policy ids
    callback => {
      getPolicies.then(
        result => {
          callback(null, result); // result should contain a list of policy ids
        },
        err => {
          console.error('Failed', err); // Error: "It broke"
        }
      );
    },
    // Secondly make batch calls to fetch the details in parallel
    (policies, callback) => {
      const { pagination, data } = policies;
      const ids = data.map(item => item.id);
      const tasks = ids.map(id => callback => {
        getDetails.then(
          details => {
            callback(null, details);
          },
          err => {
            console.error('Failed', err); // Error: "It broke"
          }
        );
      });

      async.parallel(tasks, (err, results) => {
        if (!err) {
          callback(null, {
            pagination,
            data: results,
          });
        }
      });
    },
  ],
  // optional callback
  (err, results) => {
    // the final results contain the pagination info and a list of policy details
    console.log(results);
  }
);
