var path = require('path'),
  templatesDir = path.resolve(__dirname, '.', 'templates'),
  emailTemplates = require('email-templates'),
  nodemailer = require('nodemailer');
  fs = require('fs');
  moment = require('moment');


  var Parse = require('parse').Parse;

  Parse.initialize("OBdeSxCsdErRrtcR3noBsYF5lYqPiO3FEXu8pMoo", "swRXApGLL4mq6Qht0clQj4u6kh6mrcafmNleJQmy");

  // statistic users account
  var SignReservoir = Parse.Object.extend("SignReservoir");
  var query = new Parse.Query(SignReservoir);

module.exports = function(){
  query.find({
    success: function(UserReservoir){

      for(var i=0; i<UserReservoir.length; i++){
        var PersonalInfo = {
            name: UserReservoir[i].get('username'),
            email: UserReservoir[i].get('email'),
            res0: UserReservoir[i].get('res0'),
            res1: UserReservoir[i].get('res1'),
            res2: UserReservoir[i].get('res2'),
            res3: UserReservoir[i].get('res3'),
            res4: UserReservoir[i].get('res4'),
            res5: UserReservoir[i].get('res5'),
            res6: UserReservoir[i].get('res6'),
            res7: UserReservoir[i].get('res7'),
            res8: UserReservoir[i].get('res8'),
            res9: UserReservoir[i].get('res9')
            };
        var AllInfo = AllInfo || [];
        AllInfo.push(PersonalInfo);
      }

      console.log(AllInfo);
      var today = moment().format('YYYY-MM-DD');
      fs.readFile('./data/' + today, function(err, data) {
        if (err) return;

        data = JSON.parse(data);
        var d = [];
        // for(var i=0;i<data.length;i++)
        // {
        //   d.push(data[i].immediatePercentage);
        //   if(data[i].immediatePercentage < 50)
        //   {
        //
        //   }
        // }

        for(var i=0;i<AllInfo.length;i++)
        {
          email(AllInfo[i].email);
        }
      });
    }

  });
};

function RandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < Math.random() * 100000; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function email(user) {
emailTemplates(templatesDir, function(err, template) {

    if (err) {
      console.log(err);
    } else {
      // Prepare nodemailer transport object
      var transportBatch = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
          user: "1032se.team7",
          pass: "nccu1032se"
        }
      });

      // An example users object
      var count = 0;
      var users = [{
          email: user,
          content: RandomString()
        }
        /*, {
              email: 'mingsuper@gmail.com',
              name: {
                first: 'Jerry',
                last: 'Wang'
              },
              content: RandomString()
            }, {
              email: '100703029@nccu.edu.tw',
              name: {
                first: 'Eric',
                last: 'TYL'
              },
              content: RandomString()
            }, {
              email: '101703049@nccu.edu.tw',
              name: {
                first: '柏辰',
                last: '林'
              },
              content: RandomString()
            }, {
              email: 'businputer5865@gmail.com',
              name: {
                first: '一嘉',
                last: '蔡'
              },
              content: RandomString()
            }*/
      ];

      // Custom function for sending emails outside the loop
      //
      //  We need to patch postmark.js module to support the API call
      //  that will let us send a batch of up to 500 messages at once.
      //  (e.g. <https://github.com/diy/trebuchet/blob/master/lib/index.js#L160>)
      var Render = function(locals) {
        this.locals = locals;
        this.send = function(err, html, text) {
          if (err) {
            console.log(err);
          } else {
            transportBatch.sendMail({
              from: 'Taiwan WaterReservoir<seal456ie@gmail.com',
              to: locals.email,
              subject: 'Script Email Sending Test',
              html: html,
              // generateTextFromHTML: true,
              text: text
            }, function(err, responseStatus) {
              count++;
              if (err) {
                console.log(err);
              } else {
                console.log(responseStatus.message);
              }

              if (count === users.length)
                transportBatch.close();
            });
          }
        };
        this.batch = function(batch) {
          batch(this.locals, templatesDir, this.send);
        };
      };

      // Load the template and send the emails
      template('welcome-email', true, function(err, batch) {
        for (var user in users) {
          var render = new Render(users[user]);
          render.batch(batch);
        }

      });

    }
  })
};
