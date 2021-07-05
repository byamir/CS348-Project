import cApi from '../services/classification/classificationApi';
import uApi from '../services/user/userApi';
import {useState, useEffect} from 'react';
import { User } from '../services/user/userModel';

const ClassifyImageModal = () => {
  const [user,setUser] = useState<User|{}>({});
  const [image,setImage] = useState('');
  const [potentialLabel, setPotentialLabel] = useState('...');
  
  useEffect(() => {
      uApi.getUser().then((val) => setUser(val));
  }, [user])

  useEffect(() => {
    if(image === '')
      getNewImage()  
  },[image]);

  const randomString = ():string => {return Math.random.toString().substring(16)}

  const getNewImage = async () => {
    const result = await cApi.getClassificationProblem();
    console.log(result)
    setImage(result?.url);
    setPotentialLabel(result?.label[0]?.name);
  }

  const buttonClick = (isTrueLabel: boolean) => {
    cApi.postClassificationSolution(
      randomString(),
      randomString(),
      isTrueLabel,
      user);
      getNewImage()
  };

  
  return (
    <div style={{display:"flex", flexDirection: "column",  textAlign: "center"}}>
      <header style={{position:"absolute", width:"100%",flexGrow:1, color: "white",}}>
        Is this a(n) {potentialLabel}
      </header>
      <div style={{ width:"100%", height:"100%"}}>
          <img src={image} style={{objectFit:"contain"}} alt="to classify"/>
      </div>
      <div style={{display: "flex", width:"100%", height:"auto", flexShrink: 0}}>
          <button onClick= {() => {buttonClick(true)}}  style={Object.assign({}, buttonStyle, {backgroundColor:"green"}) } >Yes</button>
          <button onClick={()=> {buttonClick(false)}} style={Object.assign({}, buttonStyle, {backgroundColor:"red"})}>No</button>
          <button onClick={()=> {getNewImage()}} style={Object.assign({}, buttonStyle, {backgroundColor:"grey"})}>I Don't Know</button>
      </div>
    </div>
  );
}

const buttonStyle = { 
  height:"100%",
  width:"100%", 
  cursor: "pointer",
  "text-transform": "uppercase",
  color: "white",
  padding: "5px 15px",
  "border-radius": "5px",
  "font-size": "3em",
}

export default ClassifyImageModal;
