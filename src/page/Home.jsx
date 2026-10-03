import React, { useState, useEffect } from 'react';
import './Home.css';
import { supabase } from '../supabase/supabase';
import Loading from '../Loading/Loading'
// import Like from '../supabase/Like';

const Home = () => {
  // ЭМИ API_URL КЕРЕК ЭМЕС. Түз supabase менен иштейбиз
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    category: 'remont',
    image: '',
    video: '',
    text: ''
  });

  // ОҚУУ - READ
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
       .from('products') // таблицанын аты
       .select('*')
       .order('id', { ascending: false }); // жаңылары өйдө чыксын

      if (error) throw error;
      
      setProjects(data);
      console.log(supabase);
      console.log(data);
      setLoading(false);
    } catch (err) {
      console.error("Маалымат жүктөөдө ката:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  // КОШУУ ЖАНА ӨЗГӨРТҮҮ - CREATE & UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title ||!formData.category) {
      alert("Аталышын жана категориясын сөзсүз толтуруңуз!");
      return;
    }

    try {
      let error;
      if (editId) {
        // Эгер editId бар болсо - ӨЗГӨРТҮҮ
        const { error: updateError } = await supabase
         .from('products')
         .update(formData)
         .eq('id', editId);
        error = updateError;
      } else {
        // Эгер editId жок болсо - ЖАҢЫ КОШУУ
        const { error: insertError } = await supabase
         .from('products')
         .insert([formData]);
        error = insertError;
      }

      if (error) throw error;

      alert(editId? "Долбоор ийгиликтүү жаңыртылды! 🔄" : "Долбоор ийгиликтүү кошулду! 🎉");
      resetForm();
      fetchProjects();
    } catch (err) {
      console.log(fetchProjects);
      
      console.error("Сайтка жиберүүдө ката кетти:", err);
      alert("Ката кетти: " + err.message);
    }
  };

  const handleEditClick = (project) => {
    setEditId(project.id);
    setFormData({
      title: project.title || '',
      location: project.location || '',
      category: project.category || 'remont',
      image: project.image || '',
      video: project.video || '',
      text: project.text || ''
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ title: '', location: '', category: 'remont', image: '', video: '', text: '' });
    setEditId(null);
    setIsFormOpen(false);
  };

  // ӨЧҮРҮҮ - DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Бул долбоорду өчүрүүнү каалайсызбы?")) {
      try {
        const { error } = await supabase
         .from('products')
         .delete()
         .eq('id', id);

        if (error) throw error;
        
        alert("Долбоор өчүрүлдү!");
        fetchProjects();
      } catch (err) {
        console.error("Өчүрүүдө ката кетти:", err);
        alert("Ката кетти: " + err.message);
      }
    }
  };

  const getEmbedVideoUrl = (url) => {
    if (!url) return null;
    if (url.includes('streamable.com/e/')) return url;
    return url.replace('streamable.com/', 'streamable.com/e/');
  };

  return (
    <div className="premium-admin-container">
      <header className="premium-header">
        <div className="brand-info">
          <h1>Каганат<span>Премиум</span></h1>
          <p>Башкаруу жана Контент Тутуму</p>
        </div>
        
        <button 
          className={`toggle-form-btn ${isFormOpen? 'active' : ''}`}
          onClick={() => { if (isFormOpen) resetForm(); else setIsFormOpen(true); }}
        >
          {isFormOpen? '❌ Форманы жабуу' : '➕ Сайтка маалымат жүктөө'}
        </button>
      </header>

      <div className={`sliding-form-wrapper ${isFormOpen? 'open' : ''}`}>
        <div className="form-inner-card">
          <h3>{editId? '📝 Долбоордун маалыматтарын өзгөртүү' : 'Жаңы Долбоор Киргизүү Терминалы'}</h3>
          <form onSubmit={handleSubmit} className="premium-form">
            <div className="form-row">
              <div className="form-field">
                <label>Долбоордун аталышы *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Мис: Люкс Квартира Ремонту" required />
              </div>
              <div className="form-field">
                <label>Жайгашкан жери (Дареги)</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Мис: Бишкек ш., Асанбай" />
              </div>
              <div className="form-field">
                <label>Категориясы *</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="remont">Евро Ремонт (remont)</option>
                  <option value="design">Интерьер Дизайн (design)</option>
                  <option value="construction">Курулуш (construction)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Сүрөт шилтемеси (ImgBB)</label>
                <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://i.ibb.co/..." />
              </div>
              <div className="form-field">
                <label>Видео шилтемеси (Streamable)</label>
                <input type="text" name="video" value={formData.video} onChange={handleChange} placeholder="https://streamable.com/..." />
              </div>
            </div>

            <div className="form-field">
              <label>Долбоор тууралуу кыскача түшүндүрмө</label>
              <textarea name="text" value={formData.text} onChange={handleChange} rows="3" placeholder="Аткарылган жумуштун өзгөчөлүктөрүн жазыңыз..."></textarea>
            </div>

            <div className="form-buttons-group">
              <button type="submit" className="submit-project-btn">
                {editId? '🔄 Өзгөрүүлөрдү сактоо' : 'Ырастоо жана Сайтка чыгаруу'}
              </button>
              {editId && (
                <button type="button" onClick={resetForm} className="cancel-edit-btn">❌ Жокко чыгаруу</button>
              )}
            </div>
          </form>
        </div>
      </div>

      <main className="projects-grid-section">
        <div className="section-title-bar">
          <h2>📋 Сайтта жайгашкан долбоорлор <span>({projects.length})</span></h2>
          <p>Сайтыңыздагы визуалдык материалдардын жана маалыматтардын тизмеси</p>
        </div>

        {loading? (
          <Loading/>
        ) : (
          <div className="projects-visual-grid">
            {projects.map((p) => (
              <div className="project-visual-card" key={p.id}>
                
                <div className="card-media-preview">
                  {p.video? (
                    <iframe 
                      src={getEmbedVideoUrl(p.video)} 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      allowFullScreen 
                      title={p.title}
                      className="embedded-video-player"
                    ></iframe>
                  ) : p.image? (
                    <img src={p.image} alt={p.title} onError={(e) => {e.target.src = 'https://placehold.co/600x400?text=Сүрөт+Ката';}} />
                  ) : (
                    <div className="no-media-placeholder">🖼 Визуалдык сүрөт жок</div>
                  )}
                  <span className={`category-tag ${p.category}`}>{p.category}</span>
                </div>

                <div className="card-body-info">
                  <h4>{p.title}</h4>
                  <p className="project-address">📍 {p.location || 'Дареги көрсөтүлгөн эмес'}</p>
                  {p.text && <p className="project-description-text">{p.text}</p>}
                  
                  <div className="card-action-footer">❤️
                    <span style={{
                      display: "flex",
                      marginRight: "240px"
                    }}>{p.like}</span> 
                    <button onClick={() => handleEditClick(p)} className="edit-action-btn">
                      ✏ Өзгөртүү
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="delete-action-btn">
                      🗑 Өчүрүү
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;