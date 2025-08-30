import { Plus } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export const AddProfile = () => (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center justify-center h-40 space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-muted-foreground">Add Profile</p>
        </div>
      </CardContent>
    </Card>
  );
  