import React from "react";
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'
import { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel'



function ControlledCarousel() {

  
    const [index, setIndex] = useState(0);
  
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
  
    return (
      <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item>
        <h3><b>RUSGULA WITH MALAI</b></h3>
          <img
            className="d-block w-90" height="400" style={{margin: "0 auto",}}  
            src="https://cdn.pixabay.com/photo/2014/12/22/12/33/sweets-577230__340.jpg"
          
          />
          <Carousel.Caption>
            
          </Carousel.Caption>
         
           
        </Carousel.Item>

        <Carousel.Item>
        <h3><b>Rabri</b></h3>
          <img
            className="d-block w-90" height="400" style={{margin: "0 auto"}} 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLDH8l1gAwwlFmdkHShjZGA--rh-fUR10ArA&usqp=CAU"
          
           
          />
          <Carousel.Caption>
            
           
          </Carousel.Caption>
          
        </Carousel.Item>




        <Carousel.Item>
        <h3><b>Qalaqand</b></h3>
          <img
            className="d-block w-90" style={{margin: "0 auto"}}  height="400"
            src="https://hamariweb.com/recipes/images/recipeimages/488.jpg"
    
          />
          <Carousel.Caption>
            
            
          </Carousel.Caption>
         
        </Carousel.Item>





        <Carousel.Item>
        <h3><b>BAISAN-LADOO</b></h3>
          <img 
            className="d-block w-90" height="400" style={{margin: "0 auto"}} 
            src="https://content3.jdmagicbox.com/comp/def_content/sweet_shops/default-sweet-shops-6.jpg?clr=525c0a"
          
          />
  
          <Carousel.Caption>
           
            
          </Carousel.Caption>
          
        </Carousel.Item>
        <Carousel.Item >
        <h3><b>BURFI WITH COCONUTS</b></h3>
          <img 
            className=" d-block w-90" height="400" style={{margin: "0 auto"}} 
            src="https://i.ndtvimg.com/i/2015-07/sweet-625_625x350_51438261999.jpg"
        
          />
  
          <Carousel.Caption>
            
            
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
  }
  



   export default ControlledCarousel







// function Home() {

    
//     return (
//         <div className="main">
//         <>
//             <h1>Home</h1>

            
            



  
           

//         </>
//         </div>
//     )
// }

// export default Home;