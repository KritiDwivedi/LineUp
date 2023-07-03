// const express=require("express");
// const app=express();
// app.get("/",function(req, res){
//     var today=new Date();
//     if(today.getDay()==0 || today.getDay()==6)
//     res.send("Yayy its  the weekend !!");
//     else
//     res.send("Booooo ! You need to work today");
// })
// app.listen(3000,function(){
// console.log("Server started on port 3000");
// });





const express=require("express");
const app=express();
const mongoose=require("mongoose"); 
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
const _=require("lodash");
// const date =require(__dirname+"/date.js");  COMMENTING OUT FOR MONGO DB
// console.log(date.getDate());


//Connecting to the databse:
mongoose.connect("mongodb://localhost:27017/todolistDataBase");


//Creating Schema
const itemSchema={

name:String

};
 
//creating model


const Item=mongoose.model("Item",itemSchema);


//Create items(documents)
const item1=new Item({

name:"Buy Salad",


})

const item2=new Item({

    name:"Buy Sandals",
    
    
    })

    const item3=new Item({

        name:"Be happy",
        
        
        })

const defaultItems=[item1,item2,item3];

//New Schema for work
const listSchema={
name:String,
items:[itemSchema]
};



const List=mongoose.model("List",listSchema);

//Insert into the databse:


//****************************************COMMENTING TO AVOID INSERT EACH TIME ********************* */
// Item.insertMany(defaultItems).then(function(){

//     console.log("Saved all the data successfully");
// }).catch(function(err){
//     console.log(err);
// });

//****************************************COMMENTING TO AVOID INSERT EACH TIME ********************* */


//Finding items:



//var item="";
// **************************************ADDING MONGOOSE AND SO COMMENTING OUT THE ARRAYS **********************************


// var items=["Buy the food","Cook the food","Eat the food"];
// var workItems=[];

// **************************************ADDING MONGOOSE AND SO COMMENTING OUT THE ARRAYS **********************************




//  *************** BEFORE EJS **************************

// app.get("/",function(req, res){
// var today=new Date();
//  if(today.getDay()==0 || today.getDay()==6)
// { res.write("<h1>Yayy its the weekend !!</h1>");
// res.write("<p>And I will sleep all day longgg</p>");}
//  else
// { res.write("<h1>Booooo ! You need to work today</h1>");
// res.write("<p>But I will manage my workkk..with full focusss🔥🔥</p>")}
// res.send();
// })
// app.listen(3000,function(){
// console.log("Server started on port 3000");
// });


// ******************* SETTING EJS *************************/
//  app.set("view engine","ejs");
// app.get("/",function(req, res){
//     var today=new Date();
//     var day="";
//      if(today.getDay()==0 || today.getDay()==6)
//     {    day="weekend"
//         }
//      else
//     {day="weekday";
        
//     }
//     res.render("list",{kindOfDay:day});
//     })
//     app.listen(3000,function(){
//     console.log("Server started on port 3000");
//     });


// ***********CODE TO DISPLAY MESSAGE FOR EACH DAY IN THE WEEK************* */

// app.set("view engine","ejs");
// app.get("/",function(req, res){
//     var today=new Date();
//     var day="";
//      if(today.getDay()==0)
//     {    day="SUNDAY"
//         }
//         if(today.getDay()==1)
//         {    day="MONDAY"
//             }
//             if(today.getDay()==2)
//             {    day="TUESDAY"
//                 }
//                 if(today.getDay()==3)
//                 {    day="WEDNESDAY"
//                     }
//                     if(today.getDay()==4)
//                     {    day="THURSDAY"
//                         }
//                         if(today.getDay()==5)
//                         {    day="FRIDAY"
//                             }
//                             if(today.getDay()==6)
//                             {    day="SATURDAY"
//                                 }
//     res.render("list",{kindOfDay:day});
//     })
//     app.listen(3000,function(){
//     console.log("Server started on port 3000");
//     });


    //**************************CODE TO JAVASCRIPT FOR PRINTING WEEKDAY OR DATE INSTEAD OF MASSIVE IF=ELSE OR SWITCH CASE************************************** */
 
        app.set("view engine","ejs");
        app.get("/",function(req, res){
            // let day=date.getDate();
          Item.find().then(function(items){
// console.log(items);

if(items.length===0)
{ Item.insertMany(defaultItems).then(function(){

    console.log("Saved all the data successfully");
}).catch(function(err){
    console.log(err);
});res.redirect("/");



}
else{
    res.render("list",{listTitle:"Today",newListItem:items});
}

}).catch(function(err){
    console.log(err);
});
            })

//DELETION:
app.post("/delete",function(req,res){
// console.log(req.body);
 const checkedItemId=req.body.checkbox;
 const listName= req.body.listName;

 if(listName==="Today"){
 Item.findByIdAndRemove(checkedItemId).then(function(){

    console.log("Deleted");
    res.redirect("/");
}).catch(function(err){
    console.log(err);
});}
else{

List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}}).then(function(foundList){

res.redirect("/"+listName);



}).catch(function(err){
    console.log(err);
})


}

});







            //FOR WORK LIST -GET METHOD
            // app.get("/work",function(req,res){
            //     res.render("list",{listTitle:"Work List",newListItem:workItems});

            // })


            app.get("/:customListName",function(req,res){
            const customListName=_.capitalize(req.params.customListName);
console.log(customListName);






        //   Creating a new document to be added in the list:
        
        
        
        List.findOne({name: customListName}).then(function(foundList){
            // console.log(items);
            
            if(!foundList){
            // { console.log(" does not exists");
              
            //Create new list:
            const list=new List({
           
                name:customListName,
                items:defaultItems
            
            
               });
            
            
            
            list.save();   
            
            res.redirect("/"+customListName);
            }
            else{
                // console.log("exists");
                 res.render("list",{listTitle:customListName,newListItem:foundList.items});

            
            }
            }).catch(function(err){
                console.log(err);
            });
            
           

});
            //POST METHOD-FOR WORK LIST
            // app.post("/work",function(req,res){
            //     items=req.body.newItems;
            //     workItems.push(items);
            //     res.redirect("/work");

            // })

            app.post("/", function(req,res){
                
                console.log(req.body.list);
                // let  itemm=req.body.newItem;

                const itemName=req.body.newItem;
                const listName=req.body.list;
                const newItemm= new Item({
                    name:itemName
                });
           
                if(listName==="Today"){
                    newItemm.save();
                    res.redirect("/");
               
                }
                else{
                    List.findOne({name: listName}).then(function(foundList){
                        // console.log(items);
                        foundList.items.push(newItemm);
                        foundList.save();
                        res.redirect("/"+listName);
                        
                    })      }
             //creating a model for this new item:


//*********COMMENTING THIS OUT FOR MONGODB******** */
                // if(req.body.list==="Work"){
                //     workItems.push(item);
                
                //     res.redirect("/work");
                // }
                // else{
                //     items.push(item);
                //     // console.log(item);
                //     res.redirect("/");

                // }
            
                  

              //*********COMMENTING THIS OUT FOR MONGODB********//


            });
            //ABOUT PAGE
            app.get("/about",function(req,res){
                res.render("about");

            })
            app.listen(3000,function(){
            console.log("Server started on port 3000");
            });
  



            
            
         
             