// src/utils/aiUtils.ts

import OpenAI from 'openai';

const baseURL = "https://api.aimlapi.com/v1";
const apiKey = process.env.NEXT_PUBLIC_AIML_API_KEY;

const api = new OpenAI({
  apiKey,
  baseURL,
  dangerouslyAllowBrowser: true,
});

export interface AIResponse {
  text: string;
  code?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface BusinessScenario {
  name: string;
  description: string;
  examples: ChatMessage[];
}

const businessScenarios: BusinessScenario[] = [
  {
    name: 'Sales Analysis',
    description: 'Analyze sales data to identify trends and opportunities.',
    examples: [
      { role: 'user', content: 'What were our top-selling products last quarter?' },
      { role: 'assistant', content: "To find the top-selling products from last quarter, we'll need to analyze the sales data. Here's a Python code snippet to do that:\n\n```python\nimport pandas as pd\n\n# Assuming 'df' is our sales DataFrame\n# Filter for last quarter\nlast_quarter = df[df['date'].dt.quarter == df['date'].dt.quarter.max()]\n\n# Group by product and sum the sales\ntop_products = last_quarter.groupby('product')['sales'].sum().sort_values(descending=True)\n\n# Display top 5 products\nprint(top_products.head())\n```\n\nThis code will filter the data for the last quarter, group it by product, sum the sales, and then display the top 5 selling products. You can adjust the number of top products by changing the argument in the `head()` function." },
      { role: 'user', content: 'Can you show me the monthly sales trend for the past year?' },
      { role: 'assistant', content: "Certainly! I'll create a code snippet to visualize the monthly sales trend for the past year using matplotlib. Here's how we can do it:\n\n```python\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\n# Assuming 'df' is our sales DataFrame with a 'date' column and a 'sales' column\n# Convert date to datetime if it's not already\ndf['date'] = pd.to_datetime(df['date'])\n\n# Filter for the past year\npast_year = df[df['date'] >= df['date'].max() - pd.DateOffset(years=1)]\n\n# Group by month and sum sales\nmonthly_sales = past_year.groupby(past_year['date'].dt.to_period('M'))['sales'].sum().reset_index()\nmonthly_sales['date'] = monthly_sales['date'].dt.to_timestamp()\n\n# Create the plot\nplt.figure(figsize=(12, 6))\nplt.plot(monthly_sales['date'], monthly_sales['sales'], marker='o')\nplt.title('Monthly Sales Trend (Past Year)')\nplt.xlabel('Month')\nplt.ylabel('Total Sales')\nplt.grid(True)\n\n# Rotate x-axis labels for better readability\nplt.xticks(rotation=45)\n\n# Show the plot\nplt.tight_layout()\nplt.show()\n```\n\nThis code will create a line plot showing the monthly sales trend for the past year. Each point on the line represents the total sales for that month. The x-axis shows the months, and the y-axis shows the total sales amount." },
    ],
  },
  // ... (other business scenarios remain the same)
];

export async function queryAI(messages: ChatMessage[], scenario?: string): Promise<AIResponse> {
  try {
    let contextMessages: ChatMessage[] = [];

    if (scenario) {
      const selectedScenario = businessScenarios.find(s => s.name === scenario);
      if (selectedScenario) {
        contextMessages = [
          { role: 'system', content: `You are an AI assistant specializing in ${selectedScenario.name}. ${selectedScenario.description} Always provide Python code examples when appropriate.` },
          ...selectedScenario.examples
        ];
      }
    }

    const completion = await api.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [...contextMessages, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    console.log(response);

    if (!response) {
      throw new Error("No response from AI");
    }

    // Improved parsing to separate code from text
    const parts = response.split('```');
    let text = '';
    let code = '';

    parts.forEach((part, index) => {
      if (index % 2 === 0) {
        text += part.trim() + ' ';
      } else if (part.startsWith('python')) {
        code += part.replace('python', '').trim() + '\n';
      }
    });

    return { text: text.trim(), code: code.trim() };
  } catch (error) {
    console.error("Error querying AI:", error);
    throw error;
  }
}

export function getBusinessScenarios(): BusinessScenario[] {
  return [
    {
      name: 'Sales Analysis',
      description: 'Analyze sales data to identify trends and opportunities.',
      examples: [
        { role: 'user', content: 'What were our top-selling products last quarter?' },
        { role: 'assistant', content: "To find the top-selling products from last quarter, we'll need to analyze the sales data. Here's a Python code snippet to do that:\n\n```python\nimport pandas as pd\n\n# Assuming 'df' is our sales DataFrame\n# Filter for last quarter\nlast_quarter = df[df['date'].dt.quarter == df['date'].dt.quarter.max()]\n\n# Group by product and sum the sales\ntop_products = last_quarter.groupby('product')['sales'].sum().sort_values(descending=True)\n\n# Display top 5 products\nprint(top_products.head())\n```\n\nThis code will filter the data for the last quarter, group it by product, sum the sales, and then display the top 5 selling products." },
        { role: 'user', content: 'Can you show me the monthly sales trend for the past year?' },
        { role: 'assistant', content: "Certainly! I'll create a code snippet to visualize the monthly sales trend for the past year using matplotlib. Here's how we can do it:\n\n```python\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\n# Assuming 'df' is our sales DataFrame with a 'date' column and a 'sales' column\n# Convert date to datetime if it's not already\ndf['date'] = pd.to_datetime(df['date'])\n\n# Filter for the past year\npast_year = df[df['date'] >= df['date'].max() - pd.DateOffset(years=1)]\n\n# Group by month and sum sales\nmonthly_sales = past_year.groupby(past_year['date'].dt.to_period('M'))['sales'].sum().reset_index()\nmonthly_sales['date'] = monthly_sales['date'].dt.to_timestamp()\n\n# Create the plot\nplt.figure(figsize=(12, 6))\nplt.plot(monthly_sales['date'], monthly_sales['sales'], marker='o')\nplt.title('Monthly Sales Trend (Past Year)')\nplt.xlabel('Month')\nplt.ylabel('Total Sales')\nplt.grid(True)\n\n# Rotate x-axis labels for better readability\nplt.xticks(rotation=45)\n\n# Show the plot\nplt.tight_layout()\nplt.show()\n```\n\nThis code will create a line plot showing the monthly sales trend for the past year." },
      ],
    },
    {
      name: 'Customer Segmentation',
      description: 'Segment customers based on their behavior and characteristics.',
      examples: [
        { role: 'user', content: 'How can we segment our customers based on their purchase frequency and total spend?' },
        { role: 'assistant', content: "To segment customers based on purchase frequency and total spend, we can use a simple K-means clustering algorithm. Here's a Python code snippet to accomplish this:\n\n```python\nimport pandas as pd\nimport numpy as np\nfrom sklearn.cluster import KMeans\nimport matplotlib.pyplot as plt\n\n# Assuming 'df' is our customer DataFrame with 'customer_id', 'purchase_frequency', and 'total_spend' columns\n\n# Prepare the data for clustering\nX = df[['purchase_frequency', 'total_spend']].values\n\n# Normalize the data\nX_normalized = (X - X.mean(axis=0)) / X.std(axis=0)\n\n# Perform K-means clustering\nkmeans = KMeans(n_clusters=4, random_state=42)\ndf['cluster'] = kmeans.fit_predict(X_normalized)\n\n# Visualize the clusters\nplt.figure(figsize=(10, 8))\nscatter = plt.scatter(df['purchase_frequency'], df['total_spend'], c=df['cluster'], cmap='viridis')\nplt.xlabel('Purchase Frequency')\nplt.ylabel('Total Spend')\nplt.title('Customer Segments')\nplt.colorbar(scatter)\nplt.show()\n\n# Print cluster statistics\nprint(df.groupby('cluster')[['purchase_frequency', 'total_spend']].mean())\n```\n\nThis code will create 4 customer segments based on purchase frequency and total spend, visualize them, and print the average values for each segment." },
      ],
    },
    // Add more scenarios as needed
  ];
}
