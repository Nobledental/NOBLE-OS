'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Store, MapPin, Phone, Mail, Clock, Star,
    Camera, Upload, Globe, Award, Shield,
    Stethoscope, Heart, Smile, ChevronRight,
    Edit, Save, X, Instagram, Facebook, Twitter
} from 'lucide-react';
import { hapticPatterns } from '@/components/gestures/ios-gestures';
import { WallOfSmiles, CasePhoto } from '@/components/gallery/wall-of-smiles';

// =============================================================================
// TYPES
// =============================================================================

export interface ClinicProfile {
    id: string;
    name: string;
    tagline?: string;
    bio: string;
    logo?: string;
    coverImage?: string;

    // Contact
    phone: string;
    email: string;
    website?: string;
    address: string;
    coordinates: { lat: number; lng: number };

    // Hours
    operatingHours: Array<{
        day: string;
        open: string;
        close: string;
        isClosed: boolean;
    }>;

    // Credentials
    dciNumber: string;
    establishedYear: number;

    // Social
    socialLinks: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        youtube?: string;
    };

    // Features
    features: string[];
    certifications: string[];

    // Rating
    rating: number;
    reviewCount: number;
}

export interface DoctorCredential {
    id: string;
    name: string;
    title: string;
    photo?: string;
    qualifications: string[];
    specializations: string[];
    dciNumber: string;
    experience: number;
    bio?: string;
}

export interface ServiceMenuItem {
    id: string;
    category: string;
    name: string;
    description?: string;
    price?: number;
    showPrice: boolean;
    requestQuote: boolean;
    duration?: number;
    popular?: boolean;
}

// =============================================================================
// CLINIC PROFILE CARD
// =============================================================================

interface ClinicProfileCardProps {
    profile: ClinicProfile;
    isEditing?: boolean;
    onEdit?: () => void;
}

export function ClinicProfileCard({ profile, isEditing, onEdit }: ClinicProfileCardProps) {
    return (
        <Card className="overflow-hidden">
            {/* Cover Image */}
            <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/5">
                {profile.coverImage && (
                    <img
                        src={profile.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Logo */}
                <div className="absolute bottom-0 left-6 translate-y-1/2">
                    <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-2 flex items-center justify-center">
                        {profile.logo ? (
                            <img src={profile.logo} alt={profile.name} className="w-full h-full object-contain rounded-xl" />
                        ) : (
                            <Store className="w-12 h-12 text-primary" />
                        )}
                    </div>
                </div>

                {/* Edit Button */}
                {onEdit && (
                    <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-4 right-4"
                        onClick={onEdit}
                    >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit Profile
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="pt-16 p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">{profile.name}</h1>
                        {profile.tagline && (
                            <p className="text-muted-foreground">{profile.tagline}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <span className="font-bold">{profile.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({profile.reviewCount})</span>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-muted-foreground mb-6">{profile.bio}</p>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate">{profile.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>Open Now</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <span>DCI: {profile.dciNumber}</span>
                    </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {profile.features.map((feature, i) => (
                        <Badge key={i} variant="secondary">{feature}</Badge>
                    ))}
                </div>

                {/* Social Links */}
                <div className="flex gap-3">
                    {profile.socialLinks.instagram && (
                        <Button variant="ghost" size="icon">
                            <Instagram className="w-5 h-5" />
                        </Button>
                    )}
                    {profile.socialLinks.facebook && (
                        <Button variant="ghost" size="icon">
                            <Facebook className="w-5 h-5" />
                        </Button>
                    )}
                    {profile.website && (
                        <Button variant="ghost" size="icon">
                            <Globe className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}

// =============================================================================
// DOCTOR CREDENTIALS CARD
// =============================================================================

interface DoctorCardProps {
    doctor: DoctorCredential;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
    return (
        <Card className="p-4">
            <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                    {doctor.photo ? (
                        <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Stethoscope className="w-8 h-8 text-muted-foreground" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold">{doctor.name}</h3>
                    <p className="text-sm text-primary">{doctor.title}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {doctor.qualifications.map((q, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{q}</Badge>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {doctor.experience} years experience • DCI: {doctor.dciNumber}
                    </p>
                </div>
            </div>
            {doctor.bio && (
                <p className="text-sm text-muted-foreground mt-4">{doctor.bio}</p>
            )}
        </Card>
    );
}

// =============================================================================
// SERVICE MENU
// =============================================================================

interface ServiceMenuProps {
    services: ServiceMenuItem[];
    onRequestQuote?: (service: ServiceMenuItem) => void;
}

export function ServiceMenu({ services, onRequestQuote }: ServiceMenuProps) {
    const categories = [...new Set(services.map(s => s.category))];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Our Services</h2>
            </div>

            {categories.map(category => (
                <div key={category}>
                    <h3 className="font-medium text-lg mb-3">{category}</h3>
                    <div className="space-y-2">
                        {services
                            .filter(s => s.category === category)
                            .map(service => (
                                <div
                                    key={service.id}
                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{service.name}</span>
                                            {service.popular && (
                                                <Badge className="bg-amber-100 text-amber-700">Popular</Badge>
                                            )}
                                        </div>
                                        {service.description && (
                                            <p className="text-sm text-muted-foreground">{service.description}</p>
                                        )}
                                        {service.duration && (
                                            <p className="text-xs text-muted-foreground">~{service.duration} mins</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {service.showPrice && service.price ? (
                                            <p className="font-semibold">₹{service.price.toLocaleString('en-IN')}</p>
                                        ) : service.requestQuote ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    hapticPatterns.softTap();
                                                    onRequestQuote?.(service);
                                                }}
                                            >
                                                Get Quote
                                            </Button>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Contact for price</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// =============================================================================
// OPERATING HOURS
// =============================================================================

interface OperatingHoursProps {
    hours: ClinicProfile['operatingHours'];
}

export function OperatingHours({ hours }: OperatingHoursProps) {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    return (
        <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Operating Hours</h3>
            </div>
            <div className="space-y-2">
                {hours.map((hour) => (
                    <div
                        key={hour.day}
                        className={`flex justify-between text-sm ${hour.day === today ? 'font-medium text-primary' : ''
                            }`}
                    >
                        <span>{hour.day}</span>
                        <span>
                            {hour.isClosed ? (
                                <span className="text-red-500">Closed</span>
                            ) : (
                                `${hour.open} - ${hour.close}`
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

// =============================================================================
// GOOGLE MAPS EMBED
// =============================================================================

interface MapEmbedProps {
    address: string;
    coordinates: { lat: number; lng: number };
}

export function MapEmbed({ address, coordinates }: MapEmbedProps) {
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(address)}`;

    return (
        <Card className="overflow-hidden">
            <div className="h-48 bg-muted">
                {/* In production, use actual Google Maps embed */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
                    <div className="text-center">
                        <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{address}</p>
                    </div>
                </div>
            </div>
            <div className="p-3">
                <Button variant="outline" className="w-full" asChild>
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <MapPin className="w-4 h-4 mr-2" />
                        Get Directions
                    </a>
                </Button>
            </div>
        </Card>
    );
}

// =============================================================================
// CERTIFICATIONS DISPLAY
// =============================================================================

interface CertificationsProps {
    certifications: string[];
}

export function Certifications({ certifications }: CertificationsProps) {
    return (
        <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold">Certifications</h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {certifications.map((cert, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {cert}
                    </Badge>
                ))}
            </div>
        </Card>
    );
}
