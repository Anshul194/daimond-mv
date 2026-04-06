"use client";
import Reviews from "@/components/homepage/Reviews";

export default function TestReviewsPage() {
    // Testing with a sample category/product ID from your featured section
    const testProductId = "6965f0e64b452b08aeeb4b11";

    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 mb-10">
                <h1 className="text-3xl font-bold mb-4">Reviews Testing Page</h1>
                <p className="text-gray-600">
                    This page is rendering the <code>Reviews</code> component with:
                    <br />
                    <code>isProductReview=true</code>
                    <br />
                    <code>productId=&quot;{testProductId}&quot;</code>
                </p>
                <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded">
                    <strong>Note:</strong> You will only see reviews here that were specifically tagged with this ID.
                    General homepage reviews will be filtered out.
                </div>
            </div>

            <Reviews
                isProductReview={true}
                productId={testProductId}
            />
        </div>
    );
}
