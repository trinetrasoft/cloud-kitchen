import Link from "next/link";
import { ChefHat } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <ChefHat className="h-6 w-6 text-orange-600" />
              <span className="text-lg font-bold text-orange-600">
                Trinetra
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Authentic Indian food from 50+ cloud kitchens, delivered to your
              door. Order from multiple kitchens in a single order.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">For Customers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/kitchens" className="hover:text-foreground">
                  Browse Kitchens
                </Link>
              </li>
              <li>
                <Link href="/subscription" className="hover:text-foreground">
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-foreground">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">For Kitchen Owners</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-foreground">
                  Kitchen Dashboard
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-foreground">
                  Partner With Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-foreground cursor-pointer">
                  Help Center
                </span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer">
                  Contact Us
                </span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Trinetra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
