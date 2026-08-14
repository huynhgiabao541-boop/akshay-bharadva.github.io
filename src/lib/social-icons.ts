import { Github, Linkedin, Mail, Twitter, Youtube, Send, Globe, type LucideIcon } from "lucide-react";
import { FaFacebook, FaInstagram, FaBehance, FaDribbble, FaTiktok, FaPinterest, FaTelegram, FaXTwitter, FaArtstation } from "react-icons/fa6";

export const SOCIAL_ICONS: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  facebook: FaFacebook,
  instagram: FaInstagram,
  twitter: FaXTwitter,
  x: FaXTwitter,
  telegram: FaTelegram || Send,
  youtube: Youtube,
  behance: FaBehance,
  dribbble: FaDribbble,
  artstation: FaArtstation,
  tiktok: FaTiktok,
  pinterest: FaPinterest,
  website: Globe,
};
