import {useEffect} from 'react';

const About = ({ isDarkMode }) => {
    const bgColor = isDarkMode ? '#121212' : '#ffffff';
    const textColor = isDarkMode ? '#f8f9fa' : '#212529';
    const cardBg = isDarkMode ? '#1e1e1e' : '#ffffff';
    const listItemBg = isDarkMode ? '#1f1f1f' : '#ffffff';
    const listItemText = isDarkMode ? '#f1f1f1' : '#212529';
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return (
        <div style={{ backgroundColor: bgColor, color: textColor, minHeight: '100vh', paddingTop: '4rem' }}>
        <div className="container py-5">
            {/* Header */}
            <div className="text-center mb-5">
                <h1 className="display-5 fw-bold fade-in">Welcome to <span className="text-primary">NewsBits</span></h1>
                <p className="lead fade-in delay-1">A sleek, modern way to catch the world’s headlines — fast, focused, and fabulous.</p>
            </div>

            {/* Why NewsBits */}
            <div className="text-center mb-4" style={{paddingTop:"10px"}}>
                <h2 className="h4 fw-semibold">🚀 Why NewsBits?</h2>
                <p className="mb-4 px-3">Tired of cluttered news websites and slow apps? NewsBits brings everything you need: speed, elegance, and personalization — powered by modern tech and real user feedback.</p>
            </div>

            {/* Feature Cards */}
            <div className="row g-4 small-features" style={{paddingTop:"20px"}}>
            {[
                ['🌓 Dark & Light Mode', 'Browse in your comfort zone, whether you love darkness or brightness.'],
                ['🔖 Bookmarks & History', 'Never lose an article. Save and revisit what matters.'],
                ['🔎 Smart Search', 'Find what you want in a flash. Our search is optimized and powerful.'],
                ['🌐 Trusted Sources', 'Curated headlines from verified, top-tier sources — always fresh.']
            ].map(([title, desc], i) => (
                <div className="col-6 col-md-3" key={i}>
                    <div
                        className={`card border-0 shadow-sm h-100 text-center zoom-in delay-${i}`}
                        style={{ backgroundColor: cardBg, color: textColor }}
                    >
                        <div className="card-body p-3">
                            <h6 className="card-title mb-2">{title}</h6>
                            <p className="card-text small mb-0">{desc}</p>
                        </div>
                    </div>
                </div>
            ))}
            </div>

            {/* Roadmap Section */}
            <div className="mt-5" style={{paddingTop:"20px"}}>
            <h2 className="h5 mb-3 fw-bold text-center">📈 What’s Coming Next?</h2>
            <ul className="list-group list-group-flush shadow-sm">
                {[
                'Voice-assisted news reading',
                'Category-based newsletter subscriptions',
                'Offline read-later mode',
                'AI-powered news summarizer'
                ].map((item, idx) => (
                <li
                    key={idx}
                    className="list-group-item"
                    style={{
                    backgroundColor: listItemBg,
                    color: listItemText,
                    borderColor: isDarkMode ? '#333' : '#dee2e6'
                    }}
                >
                    {item}
                </li>
                ))}
            </ul>
            </div>

            {/* Creator Section */}
            <div className="mt-5 text-center" style={{paddingTop:"30px"}}>
            <h2 className="h5 fw-semibold mb-3">👨‍💻 Made with ❤️ by Passionate Developers</h2>
            <p className="px-3">We believe in clean UI, fast experiences, and making information accessible. NewsBits is built using the MERN stack with modern best practices.</p>
            </div>

            {/* Closing Tagline */}
            <div className="text-center mt-5 mb-3" style={{paddingTop:"20px"}}>
            <blockquote className="blockquote">
                <p className="mb-1">“The future belongs to those who read fast, think sharp, and act smart.”</p>
                <footer className="blockquote-footer mt-5" style={{ color: isDarkMode ? '#ccc' : '#6c757d' ,paddingTop:"20px" }}>NewsBits</footer>
            </blockquote>
            </div>

            {/* Footer */}
            <div className="text-center mt-3">
            <small style={{ color: isDarkMode ? '#aaa' : '#6c757d' }}>
                © {new Date().getFullYear()} NewsBits. Built for thinkers.
            </small>
            </div>
        </div>

        {/* Animations */}
        <style>{`
            .fade-in {
            animation: fadeIn 1s ease-in;
            }

            .fade-in.delay-1 {
            animation-delay: 0.3s;
            animation-fill-mode: both;
            }

            .zoom-in {
            animation: zoomIn 0.6s ease-in-out;
            }

            .zoom-in.delay-0 { animation-delay: 0s; }
            .zoom-in.delay-1 { animation-delay: 0.2s; }
            .zoom-in.delay-2 { animation-delay: 0.4s; }
            .zoom-in.delay-3 { animation-delay: 0.6s; }

            .small-features .card-title {
            font-size: 1rem;
            }

            .small-features .card-text {
            font-size: 0.85rem;
            }

            @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
            }

            @keyframes zoomIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
            }
        `}</style>
        </div>
    );
};

export default About;