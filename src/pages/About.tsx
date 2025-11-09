import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Users, Award, Heart } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & Head Chef",
      bio: "With over 15 years of culinary experience, Alex brings passion and innovation to every dish.",
    },
    {
      name: "Maria Garcia",
      role: "Operations Manager",
      bio: "Maria ensures our kitchen runs smoothly and maintains our high standards of quality.",
    },
    {
      name: "James Wilson",
      role: "Delivery Coordinator",
      bio: "James manages our delivery fleet to ensure your food arrives hot and fresh.",
    },
  ];

  const values = [
    {
      icon: <ChefHat className="h-8 w-8" />,
      title: "Quality Ingredients",
      description: "We source only the finest, locally-grown ingredients for our dishes.",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Passion for Food",
      description: "Every meal is crafted with love and attention to detail.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Focus",
      description: "We're committed to supporting our local community and neighbors.",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our business.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4">Our Story</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About FIRE CRAFT</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're passionate about bringing delicious, high-quality meals to your doorstep. 
            Our journey began with a simple idea: great food shouldn't be complicated.
          </p>
        </div>

        {/* Our Story */}
        <Card className="mb-16 shadow-lg border-border/50">
          <CardHeader>
            <CardTitle className="text-3xl">Our Journey</CardTitle>
            <CardDescription>
              How we became your favorite food delivery service
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <p className="mb-4">
              Founded in 2018 by Chef Alex Johnson, FIRE CRAFT began as a small kitchen with a big dream: 
              to revolutionize the way people experience food delivery. What started as a single food truck 
              serving the downtown area has grown into a beloved community staple.
            </p>
            <p className="mb-4">
              Our commitment to using fresh, locally-sourced ingredients and traditional cooking methods 
              quickly gained us a loyal following. We believe that food is more than just sustenance—it's 
              about bringing people together, creating memories, and sharing experiences.
            </p>
            <p>
              Today, we continue to honor our roots while embracing innovation. Our menu evolves with the 
              seasons, and we're constantly exploring new flavors and techniques to surprise and delight 
              our customers. We're proud to be part of the culinary fabric of our community.
            </p>
          </CardContent>
        </Card>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <CardTitle className="mb-2">{value.title}</CardTitle>
                <CardDescription>{value.description}</CardDescription>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="text-center p-8 bg-gradient-to-r from-primary to-[hsl(14_100%_57%)] text-white">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to Experience FIRE CRAFT?</CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Order now and taste the difference that passion and quality make
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-lg">
              Join thousands of satisfied customers who have made FIRE CRAFT their go-to food delivery service.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default About;