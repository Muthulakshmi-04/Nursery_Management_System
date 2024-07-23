const express = require('express');
const exphbs = require('express-handlebars');
const fs = require("fs");
const path = require("path")
const opn = require('opn');
const pdf = require("pdf-creator-node");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const app = express()
const hbs = exphbs.create({
    extname: 'hbs', // extension of your views
    defaultLayout: false,
    
});
const { MongoClient } = require('mongodb');


app.engine('hbs', hbs.engine);
// const hbs = require("hbs")
const LogInCollection = require("./mongodb")
let collection;
const CartItem = require('./cart');
 
const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs');
app.set('views', tempelatePath)
app.use(express.static(publicPath))
const uri = 'mongodb://localhost:27017/LoginFormPractice';
/*
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        username: 'username',
        password: 'password'
    }
});*/
// Declare collection variable

// Middleware to establish database connection and initialize collection
// Serve homepage
app.get('/', (req, res) => {
    res.render('home');
});
// Route handler for the login page
app.get('/login', (req, res) => {
    res.render('login'); // Assuming 'login.hbs' is in your 'views' directory
});
app.get('/about1', (req, res) => {
    res.render('about1'); // Assuming 'login.hbs' is in your 'views' directory
});
app.get('/contact', (req, res) => {
    res.render('contact'); // Assuming 'login.hbs' is in your 'views' directory
});

app.use((req, res, next) => {
  if (!collection) {
    MongoClient.connect(uri)
      .then(client => {
        // Initialize the collection
        collection = client.db().collection('collection');
        console.log('Connected to MongoDB');
        next(); // Continue processing after initializing collection
      })
      .catch(error => {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).send('Error connecting to database');
      });
  } else {
    next(); // Collection is already initialized, continue
  }
});
app.use((req, res, next) => {
    if (!collection) {
      MongoClient.connect(uri)
        .then(client => {
          // Initialize the collection
          collection = client.db().collection('PlantCollection');
          console.log('Connected to MongoDB');
          next(); // Continue processing after initializing collection
        })
        .catch(error => {
          console.error('Error connecting to MongoDB:', error);
          res.status(500).send('Error connecting to database');
        });
    } else {
      next(); // Collection is already initialized, continue
    }
  });
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.use(express.urlencoded({ extended: true }));




// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})
app.get('/insert', (req, res) => {
    res.render('insert')
})
app.get('/', (req, res) => {
    res.render('role')
});
app.get('/delete', (req, res) => {
    res.render('delete')
})
app.get('/', (req, res) => {
    res.render('role')
});
app.get('/update', (req, res) => {
    res.render('update')
});
app.get('/view', (req, res) => {
    res.render('view')
});
app.get('/userview', (req, res) => {
    res.render('userview')
});
app.get('/forgot-password', (req, res) => {
    res.render('forgot-password')
});
app.get('/reset-password', (req, res) => {
    res.render('reset-password')
});
app.get('/bill', (req, res) => {
    // Fetch plant data from the database and pass it to the template
    collection.find().toArray()
        .then(plants => {
            res.render('bill', { plants });
        })
        .catch(err => {
            console.error('Error fetching plant data from MongoDB:', err);
            res.send('Error fetching plant data from database');
        });
});

// app.get('/home', (req, res) => {
//     res.render('home')
// })

/*
app.post('/signup', async (req, res) => {
    
    // const data = new LogInCollection({
    //     name: req.body.name,
    //     password: req.body.password
    // })
    // await data.save()

    const data = {
        
        name: req.body.name,
        password: req.body.password,
        role1:req.body.role1
    }

    const checking = await LogInCollection.findOne({ name : req.body.name})

   try{
    if (checking.name === req.body.name && checking.password===req.body.password && checking.role===req.body.role) {
        res.send("user details already exists")
    }
    else{
        const a=await LogInCollection.insertMany([data]);
        console.log(a);
    }
   }
   catch{
    console.log("not connecting to database")
    const a=await LogInCollection.insertMany([data]);
        console.log(a);
   }

    res.status(201).render("login", {
        naming: req.body.name
    })
})*/
/*
// Generate a unique token for password reset
const crypto = require('crypto');

// Function to generate a random token
const generateToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

// Store the token in the database and send it to the user's email
app.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        // Check if the email exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("Email not found");
        }
        // Generate and save a unique token for password reset
        const token = generateToken();
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();
        // Send the token to the user's email (you need to implement this part)
        // For demonstration purposes, let's just send the token back to the client
        res.send(token);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

// Route for resetting the password using the token
app.post("/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        // Find the user by the reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Check if the token is still valid
        });
        if (!user) {
            return res.status(400).send("Invalid or expired token");
        }
        // Update the user's password and clear the reset token
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.send("Password reset successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});
*/
app.post('/signup', async (req, res) => {
    
    // const data = new LogInCollection({
    //     name: req.body.name,
    //     password: req.body.password
    // })
    // await data.save()

    const data = {
        
        name: req.body.name,
        password: req.body.password,
        role:req.body.role
    }

    const checking = await LogInCollection.findOne({ name : req.body.name})

   try{
    if (checking.name === req.body.name && checking.password===req.body.password &&checking.role===req.body.role) {
        res.send("user details already exists")
    }
    else{
        const a=await LogInCollection.insertMany([data]);
        console.log(a);
    }
   }
   catch{
 //   console.log("not connecting to database")
    const a=await LogInCollection.insertMany([data]);
        console.log(a);
   }

    res.status(201).render("login", {
        naming: req.body.name
    })
})

/*
app.post('/signup', async(req,res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    //check whether already the user data exist
const existingUser = await LogInCollection.findOne({name: data.name});
if(existingUser){
    res.send("User aready exists");
}
else {

    //hash the password
//    const saltRounds = 10;
 //   const hashedPassword = await bcrypt.hash(data.password, saltRounds);
 //   data.password = hashedPassword;
    const userdata = await LogInCollection.insertMany(data);
    console.log(userdata);
}

});

*//*
app.post('/login', (req, res) => {
    
    try {
        const check = LogInCollection.findOne({ name : req.body.name})
        if(!check) {
            res.send("user name cannot found");
        }

       if (check.password === req.body.password) {
            res.status(201).render("role", { naming: `${req.body.password}+${req.body.name}` })
        }

        else {
            res.send("incorrect password")
        }


    } 
    
    catch (e) {
    

    }


})*/


app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name : req.body.name})
        if(!check) {
            res.send("user name cannot found");
        }
        if (check.role != req.body.role) {
            res.send("Role Doesn't Match")
        }
       if (check.password === req.body.password) {
        if(req.body.role==="user")
        {
            res.status(201).render("userview", { naming: `${req.body.password}+${req.body.name}` })
        }
        else
        {
            res.status(201).render("view", { naming: `${req.body.password}+${req.body.name}`  })
        }
        }
     /*   if (check.password === req.body.password && req.body.role==="admin") {
            res.status(201).render("view", { naming: `${req.body.password}+${req.body.name}` })
        }*/

        else {
            res.send("incorrect password")
        }
        
        



    } 
    
    catch (e) {

        

    }


})

app.post('/insert', (req, res) => {
    const { plantName, BName, plantPrice } = req.body;

    collection.insertOne({ name: plantName,Botanicalname:BName, price: parseInt(plantPrice) })
        .then(result => {
            console.log('Document inserted:', result.insertedId);
            res.send('Plant inserted successfully!');
        })
        .catch(error => {
            console.error('Error inserting document:', error);
            res.status(500).send('Error inserting plant');
        });
});
app.post('/delete', (req, res) => {
    const { plantName } = req.body;

    collection.deleteOne({ name: plantName })
        .then(result => {
            console.log('Document deleted:', result.deletedCount);
            if (result.deletedCount === 1) {
                res.send('Plant deleted successfully!');
            } else {
                res.send('Plant not found!');
            }
        })
        .catch(error => {
            console.error('Error deleting document:', error);
            res.status(500).send('Error deleting plant');
        });
});
// Update route
 app.post('/update', (req, res) => {
            const { plantName, newPrice } = req.body;

            // Update the document in the collection where name matches
            collection.updateOne(
                { name: plantName }, // Filter criteria
                { $set: { price:  parseInt(newPrice) } } // Update operation
            )
            .then(result => {
                if (result.modifiedCount === 0) {
                    res.status(404).send('Plant not found');
                } else {
                    res.send('Price updated successfully!');
                }
            })
            .catch(err => {
                console.error('Error updating price:', err);
                res.status(500).send('Error updating price');
            });
        });



// Define a route to display data
app.get('/display1', (req, res) => {
    if (!collection) {
        res.status(500).send('Database connection not established');
        return;
    }

    collection.find({}).toArray()
        .then(items => {
            res.render('display1', { items: items }); // Render the 'display.hbs' template with the retrieved data
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            res.status(500).send('Error fetching items');
        });
});

// Define a route to display data
app.get('/display', (req, res) => {
    if (!collection) {
        res.status(500).send('Database connection not established');
        return;
    }

    collection.find({}).toArray()
        .then(items => {
            res.render('display', { items: items }); // Render the 'display.hbs' template with the retrieved data
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            res.status(500).send('Error fetching items');
        });
});
app.get('/order', (req, res) => {
    // Fetch plant data from the database and pass it to the template
    collection.find().toArray()
        .then(plants => {
            res.render('order', { plants });
        })
        .catch(err => {
            console.error('Error fetching plant data from MongoDB:', err);
            res.send('Error fetching plant data from database');
        });
});



// Handle form submission
app.post('/order', async(req, res) => {
    
    /*
 
    res.status(201).render("login", {
        naming: req.body.name
    })
     */
    const { plantName, quantity } = req.body;
   collection.findOne({ name: plantName })
        .then( result => {
            if (!result) {
                res.send('Plant not found in database');
                return;
            }
            const price = result.price;
            const totalPrice = calculateTotalPrice(price, quantity);
            const orderDetails = {
                plantName: plantName,
                price: price,
                quantity: quantity,
                totalPrice: totalPrice
            };
           

       //   res.render('bill1', { orderDetails });
                  // Generate PDF bill
    const html = fs.readFileSync(path.join(__dirname, "../tempelates/bill.hbs"), "utf8");
      const bill = {
        html: html,
        data: {
            plantName: plantName,
                price: price,
                quantity: quantity,
                totalPrice: totalPrice
        },
        path: "./purchase_bill.pdf"
      };
      pdf.create(bill).then(() => {
        console.log("PDF bill generated");
        res.send("Order placed successfully. PDF bill generated.");
        opn(`./purchase_bill.pdf`, { wait: false }).catch((err) => {
            console.error(`Error occurred while trying to open the bill: ${err}`);
          });
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        res.send("Error placing order. Please try again.");
      })
     

           
        })
        .catch(err => {
            console.error('Error fetching plant price from MongoDB:', err);
            res.send('Error fetching plant price from database');
        });
});

// Calculate total price
function calculateTotalPrice(plantPrice, quantity) {
    return plantPrice * quantity;
}

app.post('/bill1', (req, res) => {
    
    const { plantName, quantity } = req.body;
    collection.findOne({ name: plantName })
        .then(result => {
            if (!result) {
                res.send('Plant not found in database');
                return;
            }
            const price = result.price;
            const totalPrice = calculateTotalPrice(price, quantity);
            const orderDetails = {
                plantName: plantName,
                price: price,
                quantity: quantity,
                totalPrice: totalPrice
            };

       //   res.render('bill1', { orderDetails });
                  // Generate PDF bill
     const html = fs.readFileSync(path.join(__dirname, "../tempelates/bill.hbs"), "utf8");
      const bill = {
        html: html,
        data: {
            plantName: plantName,
                price: price,
                quantity: quantity,
                totalPrice: totalPrice
        },
        path: "./order_bill.pdf"
      };
      pdf.create(bill).then(() => {
        console.log("PDF bill generated");
        res.send("Order placed successfully. PDF bill generated.");
        opn(`./order_bill.pdf`, { wait: false }).catch((err) => {
            console.error(`Error occurred while trying to open the bill: ${err}`);
          });
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        res.send("Error placing order. Please try again.");
      })

    });  
}); 
// Calculate total price
function calculateTotalPrice(plantPrice, quantity) {
    return plantPrice * quantity;
}  





// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});




