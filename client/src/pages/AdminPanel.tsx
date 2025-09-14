import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Edit2, Trash2, Users, Leaf, MessageSquare, Box } from "lucide-react";
import type { Herb } from "@shared/schema";

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingHerb, setEditingHerb] = useState<Herb | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Check admin access
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="p-8 text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You need admin privileges to access this page.</p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const { data: herbs = [], isLoading } = useQuery<Herb[]>({
    queryKey: ["/api/herbs", search || undefined, category || undefined],
  });

  const createHerbMutation = useMutation({
    mutationFn: async (herbData: any) => {
      await apiRequest("POST", "/api/admin/herbs", herbData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/herbs"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Herb created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create herb",
        variant: "destructive",
      });
    },
  });

  const updateHerbMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PUT", `/api/admin/herbs/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/herbs"] });
      setIsEditDialogOpen(false);
      setEditingHerb(null);
      toast({
        title: "Success",
        description: "Herb updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update herb",
        variant: "destructive",
      });
    },
  });

  const deleteHerbMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/herbs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/herbs"] });
      toast({
        title: "Success",
        description: "Herb deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete herb",
        variant: "destructive",
      });
    },
  });

  const handleSubmitNew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const herbData = {
      plantName: formData.get('plantName') as string,
      scientificName: formData.get('scientificName') as string,
      description: formData.get('description') as string,
      benefits: formData.get('benefits') as string,
      cultivation: formData.get('cultivation') as string,
      climate: formData.get('climate') as string,
      category: formData.get('category') as string,
      imageUrl: formData.get('imageUrl') as string,
      model3dUrl: formData.get('model3dUrl') as string,
      usageInstructions: formData.get('usageInstructions') as string,
    };
    createHerbMutation.mutate(herbData);
  };

  const handleSubmitEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingHerb) return;
    
    const formData = new FormData(e.currentTarget);
    const herbData = {
      plantName: formData.get('plantName') as string,
      scientificName: formData.get('scientificName') as string,
      description: formData.get('description') as string,
      benefits: formData.get('benefits') as string,
      cultivation: formData.get('cultivation') as string,
      climate: formData.get('climate') as string,
      category: formData.get('category') as string,
      imageUrl: formData.get('imageUrl') as string,
      model3dUrl: formData.get('model3dUrl') as string,
      usageInstructions: formData.get('usageInstructions') as string,
    };
    updateHerbMutation.mutate({ id: editingHerb.id, data: herbData });
  };

  const handleEdit = (herb: Herb) => {
    setEditingHerb(herb);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this herb?')) {
      deleteHerbMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-xl text-muted-foreground">
                  Manage herbs database and user content
                </p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2" data-testid="button-add-herb">
                    <Plus className="w-4 h-4" />
                    <span>Add New Herb</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Herb</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitNew} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="plantName">Plant Name *</Label>
                        <Input id="plantName" name="plantName" required />
                      </div>
                      <div>
                        <Label htmlFor="scientificName">Scientific Name *</Label>
                        <Input id="scientificName" name="scientificName" required />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea id="description" name="description" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="benefits">Benefits *</Label>
                      <Textarea id="benefits" name="benefits" required 
                                placeholder="List benefits, one per line" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select name="category">
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Digestive">Digestive</SelectItem>
                            <SelectItem value="Respiratory">Respiratory</SelectItem>
                            <SelectItem value="Immunity">Immunity</SelectItem>
                            <SelectItem value="Anti-inflammatory">Anti-inflammatory</SelectItem>
                            <SelectItem value="Adaptogenic">Adaptogenic</SelectItem>
                            <SelectItem value="Brain Health">Brain Health</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="usageInstructions">Usage Instructions</Label>
                        <Input id="usageInstructions" name="usageInstructions" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" name="imageUrl" type="url" />
                      </div>
                      <div>
                        <Label htmlFor="model3dUrl">3D Model URL</Label>
                        <Input id="model3dUrl" name="model3dUrl" type="url" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="cultivation">Cultivation</Label>
                      <Textarea id="cultivation" name="cultivation" />
                    </div>
                    
                    <div>
                      <Label htmlFor="climate">Climate Requirements</Label>
                      <Textarea id="climate" name="climate" />
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" 
                              onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createHerbMutation.isPending}>
                        {createHerbMutation.isPending ? 'Creating...' : 'Create Herb'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{herbs.length}</h3>
                <p className="text-muted-foreground text-sm">Total Herbs</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold">2,847</h3>
                <p className="text-muted-foreground text-sm">Registered Users</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">8,392</h3>
                <p className="text-muted-foreground text-sm">AI Recommendations</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Box className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">89</h3>
                <p className="text-muted-foreground text-sm">3D Models</p>
              </Card>
            </div>
            
            {/* Herbs Management Table */}
            <Card className="overflow-hidden shadow-lg">
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-xl font-semibold">Herbs Database</h3>
                  <div className="flex items-center space-x-3">
                    <Input
                      placeholder="Search herbs..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-48"
                      data-testid="input-search-admin"
                    />
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        <SelectItem value="Digestive">Digestive</SelectItem>
                        <SelectItem value="Respiratory">Respiratory</SelectItem>
                        <SelectItem value="Immunity">Immunity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Herb</TableHead>
                      <TableHead>Scientific Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>3D Model</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {herbs.map((herb) => (
                      <TableRow key={herb.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {herb.imageUrl && (
                              <img 
                                src={herb.imageUrl} 
                                alt={herb.plantName} 
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{herb.plantName}</p>
                              <p className="text-sm text-muted-foreground">
                                Updated {new Date(herb.updatedAt || '').toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {herb.scientificName}
                        </TableCell>
                        <TableCell>
                          {herb.category && (
                            <Badge variant="secondary">{herb.category}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={herb.model3dUrl ? "default" : "outline"}>
                            {herb.model3dUrl ? "Available" : "Missing"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={herb.isPublished ? "default" : "secondary"}>
                            {herb.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(herb)}
                              data-testid={`button-edit-${herb.id}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(herb.id)}
                              className="text-destructive hover:text-destructive"
                              data-testid={`button-delete-${herb.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Herb</DialogTitle>
          </DialogHeader>
          {editingHerb && (
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-plantName">Plant Name *</Label>
                  <Input id="edit-plantName" name="plantName" 
                         defaultValue={editingHerb.plantName} required />
                </div>
                <div>
                  <Label htmlFor="edit-scientificName">Scientific Name *</Label>
                  <Input id="edit-scientificName" name="scientificName" 
                         defaultValue={editingHerb.scientificName} required />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea id="edit-description" name="description" 
                          defaultValue={editingHerb.description} required />
              </div>
              
              <div>
                <Label htmlFor="edit-benefits">Benefits *</Label>
                <Textarea id="edit-benefits" name="benefits" 
                          defaultValue={editingHerb.benefits} required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select name="category" defaultValue={editingHerb.category || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Digestive">Digestive</SelectItem>
                      <SelectItem value="Respiratory">Respiratory</SelectItem>
                      <SelectItem value="Immunity">Immunity</SelectItem>
                      <SelectItem value="Anti-inflammatory">Anti-inflammatory</SelectItem>
                      <SelectItem value="Adaptogenic">Adaptogenic</SelectItem>
                      <SelectItem value="Brain Health">Brain Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-usageInstructions">Usage Instructions</Label>
                  <Input id="edit-usageInstructions" name="usageInstructions" 
                         defaultValue={editingHerb.usageInstructions || ""} />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" 
                        onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateHerbMutation.isPending}>
                  {updateHerbMutation.isPending ? 'Updating...' : 'Update Herb'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
