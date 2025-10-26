import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Droplets, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const SegregationGuide = () => {
  const [showDryWaste, setShowDryWaste] = useState(true);
  const [showWetWaste, setShowWetWaste] = useState(true);
  const [showEWaste, setShowEWaste] = useState(true);

  const dryWasteItems = [
    { name: "Plastic Bottles", category: "Recyclable", color: "blue" },
    { name: "Paper & Cardboard", category: "Recyclable", color: "blue" },
    { name: "Metal Cans", category: "Recyclable", color: "blue" },
    { name: "Glass Containers", category: "Recyclable", color: "blue" },
    { name: "Fabric & Textiles", category: "Recyclable", color: "blue" },
    { name: "Rubber Items", category: "Special", color: "orange" },
  ];

  const wetWasteItems = [
    { name: "Fruit Peels", category: "Compostable", color: "green" },
    { name: "Vegetable Scraps", category: "Compostable", color: "green" },
    { name: "Food Leftovers", category: "Compostable", color: "green" },
    { name: "Coffee Grounds", category: "Compostable", color: "green" },
    { name: "Tea Bags", category: "Compostable", color: "green" },
    { name: "Eggshells", category: "Compostable", color: "green" },
    { name: "Garden Waste", category: "Compostable", color: "green" },
    { name: "Dairy Products", category: "Organic", color: "yellow" },
  ];

  const eWasteItems = [
    { name: "Mobile Phones", category: "Electronics", color: "purple" },
    { name: "Laptops & Computers", category: "Electronics", color: "purple" },
    { name: "Batteries", category: "Hazardous", color: "red" },
    { name: "Televisions", category: "Electronics", color: "purple" },
    { name: "Refrigerators", category: "Appliances", color: "indigo" },
    { name: "Washing Machines", category: "Appliances", color: "indigo" },
    { name: "Chargers & Cables", category: "Accessories", color: "purple" },
    { name: "LED Bulbs", category: "Lighting", color: "orange" },
  ];

  const getBadgeColor = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "green": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "purple": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "orange": return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "yellow": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "red": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "indigo": return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Waste Segregation Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn how to properly categorize different types of waste for effective recycling and environmental protection.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={() => setShowDryWaste(!showDryWaste)}
            variant={showDryWaste ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Dry Waste Examples
            {showDryWaste ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button
            onClick={() => setShowWetWaste(!showWetWaste)}
            variant={showWetWaste ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Droplets className="w-4 h-4" />
            Wet Waste Examples
            {showWetWaste ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button
            onClick={() => setShowEWaste(!showEWaste)}
            variant={showEWaste ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            E-Waste Examples
            {showEWaste ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Dry Waste Section */}
          <Card className={cn(
            "transition-all duration-500 border-border",
            showDryWaste ? "opacity-100 transform-none" : "opacity-50 transform scale-95"
          )}>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
                Dry Waste
              </CardTitle>
              <p className="text-muted-foreground">
                Non-biodegradable waste that can be recycled or requires special disposal
              </p>
            </CardHeader>
            <CardContent className="p-6">
              {showDryWaste && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 gap-3">
                    {dryWasteItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-medium text-foreground text-sm">{item.name}</span>
                        <Badge className={cn(getBadgeColor(item.color), "shrink-0 ml-2")}>
                          {item.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Disposal Tips:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Clean containers before recycling</li>
                      <li>• Remove labels when possible</li>
                      <li>• Separate different materials</li>
                      <li>• Take e-waste to special collection centers</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Wet Waste Section */}
          <Card className={cn(
            "transition-all duration-500 border-border",
            showWetWaste ? "opacity-100 transform-none" : "opacity-50 transform scale-95"
          )}>
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                Wet Waste
              </CardTitle>
              <p className="text-muted-foreground">
                Biodegradable organic waste that can be composted
              </p>
            </CardHeader>
            <CardContent className="p-6">
              {showWetWaste && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 gap-3">
                    {wetWasteItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-medium text-foreground text-sm">{item.name}</span>
                        <Badge className={cn(getBadgeColor(item.color), "shrink-0 ml-2")}>
                          {item.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Composting Tips:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Start a home compost bin</li>
                      <li>• Mix green and brown materials</li>
                      <li>• Turn compost regularly for aeration</li>
                      <li>• Avoid meat and dairy in compost</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* E-Waste Section */}
          <Card className={cn(
            "transition-all duration-500 border-border",
            showEWaste ? "opacity-100 transform-none" : "opacity-50 transform scale-95"
          )}>
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                E-Waste
              </CardTitle>
              <p className="text-muted-foreground">
                Electronic waste requiring special handling and recycling
              </p>
            </CardHeader>
            <CardContent className="p-6">
              {showEWaste && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 gap-3">
                    {eWasteItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-medium text-foreground text-sm">{item.name}</span>
                        <Badge className={cn(getBadgeColor(item.color), "shrink-0 ml-2")}>
                          {item.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">E-Waste Disposal Tips:</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• Never throw e-waste in regular trash</li>
                      <li>• Take to certified e-waste collection centers</li>
                      <li>• Remove batteries before disposal</li>
                      <li>• Donate working electronics for reuse</li>
                      <li>• Wipe personal data from devices</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SegregationGuide;