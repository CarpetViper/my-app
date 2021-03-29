import s from './App.module.css';
import React, {useState, useEffect} from 'react'
import {useForm} from 'react-hook-form';
import Description from './description';


const App = () => {

  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState("");
  const [articleEditing, setArticleEditing] = useState(null);
  const [editingArticle, setEditingArticle] = useState("");
  const {register, handleSubmit, errors} = useForm();

  useEffect(() => {
    const json = localStorage.getItem("articles");
    const loadedTodos = JSON.parse(json);
    if (loadedTodos) {
      setArticles(loadedTodos);
    }
  }, []);

  useEffect(() => {
    const json = JSON.stringify(articles);
    localStorage.setItem("articles", json);
  }, [articles]);

  const onSubmit = (e) => {

    const newElement = {
      id: new Date().getTime(),
      text: article,
      completed: false,
    };
    setArticles([...articles].concat(newElement));
    setArticle("");
  }

  const deleteArticle = (id) => {
    let updatedArticles = [...articles].filter((element) => element.id !== id);
    setArticles(updatedArticles);
  }

  const toggleComplete = (id) => {
    let updatedArticles = [...articles].map((element) => {
      if (element.id === id) {
        element.completed = !element.completed;
      }
      return element;
    });
    setArticles(updatedArticles);
  }

  const submitEdits = (id) => {
    const updatedArticles = [...articles].map((element) => {
      if (element.id === id) {
        element.text = editingArticle;
      }
      return element;
    });
    setArticles(updatedArticles);
    setArticleEditing(null);
  }

    return (
     <div className={s.page__row}>
          <div className={s.page__cell}>
            <div>
              <Description/>
            </div>
              <form onSubmit={handleSubmit(onSubmit)}>
              <textarea
               className={s.textarea}
               type="text"
               name='textarea'
               onChange={(e) => setArticle(e.target.value)}
               ref={register({required: true, maxLength: 300})}
               value={article}
              />
              {errors.textarea && errors.textarea.type === 'required' && (<p>Field is required</p>)}
              {errors.textarea && errors.textarea.type === 'maxLength' && (<p>Max length 150 simbols</p>)}
              <div>
              <input type='submit' value='submit' id='inputArticle' className={s.hide}/>
              <label htmlFor="inputArticle" className={s.inputTextLabel}>Submit</label>
              </div>
              </form>
              { [...articles].reverse().map((element) => (
                <div key={element.id}>
                   <div className={s.el}>
                       <input
                        type="checkbox"
                        id="completed"
                        checked={element.completed}
                        onChange={() => toggleComplete(element.id)}
                       />
                       {element.id === articleEditing ? (
                       <input
                        className={s.setEditingArticle}
                        type="text"
                        onChange={(e) => setEditingArticle(e.target.value)}
                       /> 
                       ) : (
                       <div className={s.textElement}>{element.text}</div>)}
                   </div>
                       <div className={s.todoActions}>
                   {element.id === articleEditing ? (
                   <div>
                   <label 
                      onClick={() => submitEdits(element.id)} 
                      className={s.submitEditsLabel}>Submit Edits</label>
                   </div>
                   ) : ( 
                   <div>
                   <label 
                       onClick={() => deleteArticle(element.id)} 
                       className={s.deleteArticleLabel}>Delete</label>
                   </div>
                   )}
                   <label 
                        onClick={() => setArticleEditing(element.id)} 
                        className={s.setArticleEditingLabel}>Edit</label>
                   </div>
                </div>
              ))}
          </div>
     </div>
    )
}

export default App;
