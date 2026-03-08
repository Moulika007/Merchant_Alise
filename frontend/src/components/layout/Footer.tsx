import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                            <span className="bg-primary text-white p-1.5 rounded-lg">All</span>
                            Together
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Your ultimate destination for quality products across tech, fashion, home, and more. Experience shopping reimagined.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-primary mb-4">Quick Links</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/store" className="text-muted-foreground hover:text-primary transition-colors">Shop All</Link></li>
                            <li><Link to="/store?filter=trending" className="text-muted-foreground hover:text-primary transition-colors">Trending Now</Link></li>
                            <li><Link to="/store?filter=new" className="text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
                            <li><Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors">Categories</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-semibold text-primary mb-4">Customer Service</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/shipping-returns" className="text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link></li>
                            <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link to="/track-order" className="text-muted-foreground hover:text-primary transition-colors">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h4 className="font-semibold text-primary mb-4">Stay Connected</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground mb-4">
                            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> 123 Commerce St, New York, NY 10001</li>
                            <li className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" /> (555) 123-4567</li>
                            <li className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" /> support@alltogether.com</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
                    <p>&copy; {new Date().getFullYear()} AllTogether. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
