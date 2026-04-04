package browserSetUp;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class BrowserSetUP {
	public WebDriver driver;
	@BeforeClass
	public void openChrome() {
		ChromeOptions options=new ChromeOptions();
		options.setExperimentalOption("debuggerAddress", "127.0.0.1:9222");
		driver=new ChromeDriver(options);
		
	}
	@Test
	public void test() throws InterruptedException {
		driver.findElement(By.xpath("//li//a[@href='/projects']")).click();
		 WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

		    WebElement element = wait.until(
		        ExpectedConditions.elementToBeClickable(By.xpath("//div[text()='Symphony']"))
		    );

		    element.click();
	}

}
